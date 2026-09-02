import 'package:flutter/material.dart';

import '../formats.dart';
import '../labels.dart';
import '../models.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';
import 'new_voucher_screen.dart';
import 'voucher_detail_screen.dart';

class VouchersPage extends StatefulWidget {
  final Company company;

  const VouchersPage({super.key, required this.company});

  @override
  State<VouchersPage> createState() => _VouchersPageState();
}

class _VouchersPageState extends State<VouchersPage> {
  List<DayBookRow> _rows = const [];
  bool _loading = true;
  String? _error;
  String _type = '';
  int _page = 0;
  bool _hasMore = true;
  static const _pageSize = 50;

  @override
  void initState() {
    super.initState();
    _reload();
  }

  Future<void> _reload() async {
    setState(() {
      _loading = true;
      _page = 0;
    });
    _rows = const [];
    await _loadPage();
    setState(() {});
  }

  Future<void> _loadPage() async {
    try {
      final rows = await AppState.instance.api.dayBook(
        companyId: widget.company.id,
        fyId: AppState.instance.fy?.id,
        type: _type.isEmpty ? null : _type,
        limit: _pageSize + 1,
      );
      setState(() {
        if (_page == 0) {
          _rows = rows.length > _pageSize
              ? rows.sublist(0, _pageSize)
              : rows;
        } else {
          _rows = [..._rows, ...(rows.length > _pageSize ? rows.sublist(0, _pageSize) : rows)];
        }
        _hasMore = rows.length > _pageSize;
        _page++;
        _loading = false;
        _error = null;
      });
    } on Exception catch (e) {
      setState(() {
        _loading = false;
        _error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
            child: Row(
              children: [
                Expanded(
                  child: Text('Vouchers',
                      style: Theme.of(context).textTheme.titleSmall),
                ),
                FilledButton.tonalIcon(
                  onPressed: () async {
                    await Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => NewVoucherScreen(company: widget.company),
                      ),
                    );
                    _reload();
                  },
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text('New'),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                for (final (key, label) in const [
                  ('', 'All'),
                  ('receipt', 'Receipt'),
                  ('payment', 'Payment'),
                  ('journal', 'Journal'),
                  ('contra', 'Contra'),
                  ('sales', 'Sales'),
                  ('purchase', 'Purchase'),
                  ('credit_note', 'Credit Note'),
                  ('debit_note', 'Debit Note'),
                ])
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(label),
                      selected: _type == key,
                      onSelected: (_) {
                        setState(() => _type = key);
                        _reload();
                      },
                    ),
                  ),
              ],
            ),
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? ErrorMessage(message: _error!, onRetry: _reload)
                    : _buildList(),
          ),
        ],
      ),
    );
  }

  Widget _buildList() {
    if (_rows.isEmpty) {
      return RefreshIndicator(
        onRefresh: _reload,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          children: const [
            Padding(
              padding: EdgeInsets.only(top: 120),
              child: EmptyState(
                  message: 'No vouchers yet.', icon: Icons.receipt_long),
            ),
          ],
        ),
      );
    }
    return ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      itemCount: _rows.length + (_hasMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index >= _rows.length) {
          return Padding(
            padding: const EdgeInsets.all(12),
            child: Center(
              child: TextButton(
                onPressed: _loadPage,
                child: const Text('Load more'),
              ),
            ),
          );
        }
        final row = _rows[index];
        final amount = (row.debit - row.credit).abs();
        final isOut = row.debit - row.credit < 0;
        return Card(
          elevation: 0,
          margin: const EdgeInsets.only(bottom: 8),
          color: Theme.of(context).colorScheme.surfaceContainerLow,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12)),
          child: ListTile(
            dense: true,
            leading: CircleAvatar(
              radius: 18,
              backgroundColor: row.status == 'cancelled'
                  ? Theme.of(context).colorScheme.errorContainer
                  : Theme.of(context).colorScheme.secondaryContainer,
              child: Icon(
                _typeIcon(row.voucherType),
                size: 18,
                color: row.status == 'cancelled'
                    ? Theme.of(context).colorScheme.onErrorContainer
                    : Theme.of(context).colorScheme.onSecondaryContainer,
              ),
            ),
            title: Text(
              '${voucherTypeLabels[row.voucherType] ?? row.voucherType} '
              '${row.voucherNumber}',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            subtitle: Text(
              '${shortDate(parseIso(row.voucherDate) ?? DateTime.now())}'
              '${row.partyName == null ? '' : ' · ${row.partyName}'}'
              '${row.status == 'cancelled' ? ' · CANCELLED' : ''}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: Text(
              '₹${money(amount)}',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: isOut
                    ? Theme.of(context).colorScheme.onSurfaceVariant
                    : Theme.of(context).colorScheme.onSurface,
              ),
            ),
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => VoucherDetailScreen(
                    voucherId: row.id, company: widget.company),
              ),
            ),
          ),
        );
      },
    );
  }

  IconData _typeIcon(String type) {
    switch (type) {
      case 'receipt':
        return Icons.call_received;
      case 'payment':
        return Icons.call_made;
      case 'contra':
        return Icons.swap_vert;
      case 'sales':
        return Icons.shopping_cart;
      case 'purchase':
        return Icons.shopping_bag;
      case 'credit_note':
        return Icons.assignment_return;
      case 'debit_note':
        return Icons.assignment_late;
      default:
        return Icons.receipt_long;
    }
  }
}