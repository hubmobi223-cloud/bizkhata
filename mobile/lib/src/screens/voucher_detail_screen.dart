import 'package:flutter/material.dart';

import '../formats.dart';
import '../labels.dart';
import '../models.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';

class VoucherDetailScreen extends StatefulWidget {
  final String voucherId;
  final Company company;

  const VoucherDetailScreen({
    super.key,
    required this.voucherId,
    required this.company,
  });

  @override
  State<VoucherDetailScreen> createState() => _VoucherDetailScreenState();
}

class _VoucherDetailScreenState extends State<VoucherDetailScreen> {
  ({
    DayBookRow voucher,
    List<LedgerPosting> entries,
    List<VoucherItem> items
  })? _data;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await AppState.instance.api.voucherDetail(
        companyId: widget.company.id,
        voucherId: widget.voucherId,
      );
      if (!mounted) return;
      setState(() {
        _data = data;
        _loading = false;
      });
    } on Exception catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  Future<void> _cancel() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel voucher'),
        content: const Text(
            'The voucher will be marked cancelled and stock will be rolled back. '
            'This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Keep'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Cancel voucher'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    try {
      await AppState.instance.api.cancelVoucher(widget.voucherId);
      AppState.instance.bump();
      await _load();
    } on Exception catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Voucher')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? ErrorMessage(message: _error!, onRetry: _load)
              : _data == null
                  ? const EmptyState(message: 'Voucher not found.')
                  : _build(context),
    );
  }

  Widget _build(BuildContext context) {
    final data = _data!;
    final voucher = data.voucher;
    final cancelled = voucher.status == 'cancelled';

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          elevation: 0,
          color: Theme.of(context).colorScheme.surfaceContainerLow,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${voucherTypeLabels[voucher.voucherType] ?? voucher.voucherType} '
                        '${voucher.voucherNumber}',
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium
                            ?.copyWith(fontWeight: FontWeight.w700),
                      ),
                    ),
                    if (cancelled)
                      Chip(
                        label: const Text('CANCELLED'),
                        backgroundColor:
                            Theme.of(context).colorScheme.errorContainer,
                        labelStyle: TextStyle(
                          color: Theme.of(context).colorScheme.onErrorContainer,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      )
                    else
                      Chip(
                        label: const Text('POSTED'),
                        backgroundColor:
                            Theme.of(context).colorScheme.secondaryContainer,
                        labelStyle: TextStyle(
                          color:
                              Theme.of(context).colorScheme.onSecondaryContainer,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                InfoRow(
                    label: 'Date',
                    value: shortDate(
                        parseIso(voucher.voucherDate) ?? DateTime.now())),
                if (voucher.partyName != null)
                  InfoRow(label: 'Party', value: voucher.partyName!),
                if (voucher.narration != null)
                  InfoRow(label: 'Narration', value: voucher.narration!),
                InfoRow(label: 'Amount', value: '₹${money((voucher.debit - voucher.credit).abs())}', emphasized: true),
              ],
            ),
          ),
        ),
        if (data.items.isNotEmpty) ...[
          const SizedBox(height: 16),
          Text('Items', style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 8),
          Card(
            elevation: 0,
            margin: EdgeInsets.zero,
            color: Theme.of(context).colorScheme.surfaceContainerLow,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14)),
            child: Column(
              children: [
                _row(context, 'Item', 'Taxable', 'GST'),
                for (final item in data.items)
                  Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.itemName ?? 'Item',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.w600)),
                              Text(
                                '${qty(item.qty)} × ₹${money(item.rate)}'
                                '${item.hsnSac == null ? '' : ' · ${item.hsnSac}'}',
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text('₹${money(item.taxableValue)}'),
                        const SizedBox(width: 16),
                        SizedBox(
                          width: 64,
                          child: Text(
                            '${_money0(item.gstRate)}%',
                            textAlign: TextAlign.right,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 16),
        Text('Entries', style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 8),
        Card(
          elevation: 0,
          margin: EdgeInsets.zero,
          color: Theme.of(context).colorScheme.surfaceContainerLow,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14)),
          child: Column(
            children: [
              _row(context, 'Ledger / Account', 'Debit', 'Credit'),
              for (final entry in data.entries)
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(entry.ledgerName,
                            style: const TextStyle(
                                fontWeight: FontWeight.w600)),
                      ),
                      SizedBox(
                        width: 84,
                        child: Text(
                          entry.debit > 0 ? '₹${money(entry.debit)}' : '—',
                          textAlign: TextAlign.right,
                        ),
                      ),
                      SizedBox(
                        width: 84,
                        child: Text(
                          entry.credit > 0 ? '₹${money(entry.credit)}' : '—',
                          textAlign: TextAlign.right,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
        if (!cancelled) ...[
          const SizedBox(height: 24),
          OutlinedButton.icon(
            onPressed: _cancel,
            style: OutlinedButton.styleFrom(
              foregroundColor: Theme.of(context).colorScheme.error,
            ),
            icon: const Icon(Icons.block),
            label: const Text('Cancel voucher'),
          ),
        ],
      ],
    );
  }

  Widget _row(BuildContext context, String a, String b, String c) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 8),
      color: Theme.of(context).colorScheme.surfaceContainerHighest,
      child: Row(
        children: [
          Expanded(
            child: Text(a, style: Theme.of(context).textTheme.labelSmall),
          ),
          SizedBox(
            width: 84,
            child: Text(b,
                textAlign: TextAlign.right,
                style: Theme.of(context).textTheme.labelSmall),
          ),
          SizedBox(
            width: 84,
            child: Text(c,
                textAlign: TextAlign.right,
                style: Theme.of(context).textTheme.labelSmall),
          ),
        ],
      ),
    );
  }

  String _money0(double value) {
    if (value == value.roundToDouble()) return value.toStringAsFixed(0);
    return value.toStringAsFixed(2);
  }
}