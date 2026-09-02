import 'package:flutter/material.dart';

import '../formats.dart';
import '../models.dart';
import '../services/api.dart';
import '../services/app_state.dart';
import '../widgets/pickers.dart';

class NewVoucherScreen extends StatefulWidget {
  final Company company;

  const NewVoucherScreen({super.key, required this.company});

  @override
  State<NewVoucherScreen> createState() => _NewVoucherScreenState();
}

class _Line {
  String? ledgerId;
  double debit = 0;
  double credit = 0;
}

class _NewVoucherScreenState extends State<NewVoucherScreen> {
  final _narration = TextEditingController();
  String _type = 'receipt';
  DateTime _date = DateTime.now();
  final List<_Line> _lines = [_Line(), _Line()];
  List<Ledger> _ledgers = const [];
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    AppState.instance.api.ledgers(widget.company.id).then((list) {
      if (mounted) setState(() => _ledgers = list);
    }).catchError((Object _) {
      if (mounted) setState(() => _error = 'Could not load ledgers.');
    });
  }

  @override
  void dispose() {
    _narration.dispose();
    super.dispose();
  }

  double get _debitTotal =>
      _lines.fold<double>(0, (sum, l) => sum + l.debit);
  double get _creditTotal =>
      _lines.fold<double>(0, (sum, l) => sum + l.credit);
  bool get _balanced => (_debitTotal - _creditTotal).abs() < 0.005;

  Future<void> _pickLedger(_Line line) async {
    final id = await pickItem<Ledger>(
      context,
      title: 'Choose ledger',
      items: _ledgers,
      idOf: (l) => l.id,
      labelOf: (l) => l.name,
      selectedId: line.ledgerId,
    );
    if (id != null) setState(() => line.ledgerId = id);
  }

  Future<void> _post() async {
    final entries = <Map<String, dynamic>>[];
    for (var i = 0; i < _lines.length; i++) {
      final line = _lines[i];
      if (line.ledgerId == null) continue;
      if (line.debit == 0 && line.credit == 0) continue;
      entries.add({
        'entry_no': i + 1,
        'ledger_id': line.ledgerId,
        'debit': line.debit,
        'credit': line.credit,
      });
    }
    if (entries.length < 2) {
      setState(() => _error = 'A voucher needs at least two entries');
      return;
    }
    if (!_balanced) {
      setState(() => _error =
          'Debit and credit totals must match (difference ${_money((_debitTotal - _creditTotal).abs())})');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final fyId = AppState.instance.fy?.id;
      if (fyId == null) throw const BizKhataException('No active financial year');
      final iso = _isoDate(_date);
      final voucherId = await AppState.instance.api.postVoucher(
        companyId: widget.company.id,
        fyId: fyId,
        type: _type,
        date: iso,
        narration: _narration.text,
        entries: entries,
      );
      AppState.instance.bump();
      if (mounted) {
        Navigator.of(context).pop(voucherId);
      }
    } on BizKhataException catch (e) {
      if (mounted) setState(() => _error = e.message);
    } catch (_) {
      if (mounted) setState(() => _error = 'Could not post voucher');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        title: const Text('New voucher'),
        actions: [
          TextButton(
            onPressed: _busy ? null : _post,
            child: const Text('Post'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<String>(
            initialValue: _type,
            decoration: const InputDecoration(
              labelText: 'Voucher type',
              border: OutlineInputBorder(),
            ),
            items: const [
              DropdownMenuItem(value: 'receipt', child: Text('Receipt')),
              DropdownMenuItem(value: 'payment', child: Text('Payment')),
              DropdownMenuItem(value: 'journal', child: Text('Journal')),
              DropdownMenuItem(value: 'contra', child: Text('Contra')),
            ],
            onChanged: (v) => setState(() => _type = v ?? _type),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _date,
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                    );
                    if (picked != null) setState(() => _date = picked);
                  },
                  icon: const Icon(Icons.calendar_month, size: 18),
                  label: Text('Date: ${shortDate(_date)}'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _narration,
            decoration: const InputDecoration(
              labelText: 'Narration (optional)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            elevation: 0,
            margin: EdgeInsets.zero,
            color: scheme.surfaceContainerLow,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14)),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
                  child: Row(
                    children: [
                      const Expanded(child: Text('Ledger')),
                      SizedBox(
                        width: 90,
                        child: Text('Debit',
                            textAlign: TextAlign.right,
                            style: Theme.of(context).textTheme.labelSmall),
                      ),
                      SizedBox(
                        width: 90,
                        child: Text('Credit',
                            textAlign: TextAlign.right,
                            style: Theme.of(context).textTheme.labelSmall),
                      ),
                    ],
                  ),
                ),
                for (final line in _lines)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 4),
                    child: Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () => _pickLedger(line),
                            borderRadius: BorderRadius.circular(8),
                            child: InputDecorator(
                              decoration: const InputDecoration(
                                border: OutlineInputBorder(),
                              ),
                              child: Text(
                                _ledgers
                                        .firstWhere((l) => l.id == line.ledgerId,
                                            orElse: () => const Ledger(
                                                id: '',
                                                accountGroupId: '',
                                                name: 'Choose ledger…'))
                                        .name,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        SizedBox(
                          width: 88,
                          child: TextField(
                            keyboardType: const TextInputType
                                .numberWithOptions(decimal: true),
                            textAlign: TextAlign.right,
                            decoration: const InputDecoration(
                                isDense: true, border: OutlineInputBorder()),
                            onChanged: (v) => setState(() {
                              final value = double.tryParse(v) ?? 0;
                              line.debit = value;
                              if (value > 0) line.credit = 0;
                            }),
                          ),
                        ),
                        const SizedBox(width: 6),
                        SizedBox(
                          width: 88,
                          child: TextField(
                            keyboardType: const TextInputType
                                .numberWithOptions(decimal: true),
                            textAlign: TextAlign.right,
                            decoration: const InputDecoration(
                                isDense: true, border: OutlineInputBorder()),
                            onChanged: (v) => setState(() {
                              final value = double.tryParse(v) ?? 0;
                              line.credit = value;
                              if (value > 0) line.debit = 0;
                            }),
                          ),
                        ),
                      ],
                    ),
                  ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          TextButton.icon(
                            onPressed: () => setState(() => _lines.add(_Line())),
                            icon: const Icon(Icons.add, size: 18),
                            label: const Text('Add line'),
                          ),
                          if (_lines.length > 2)
                            IconButton(
                              onPressed: () => setState(() => _lines.removeLast()),
                              icon: const Icon(Icons.remove, size: 18),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
                  color: scheme.surfaceContainerHighest,
                  child: Row(
                    children: [
                      const Expanded(
                          child: Text('Total',
                              style: TextStyle(fontWeight: FontWeight.w700))),
                      SizedBox(
                        width: 88,
                        child: Text('₹${money(_debitTotal)}',
                            textAlign: TextAlign.right,
                            style: const TextStyle(fontWeight: FontWeight.w700)),
                      ),
                      SizedBox(
                        width: 88,
                        child: Text('₹${money(_creditTotal)}',
                            textAlign: TextAlign.right,
                            style: const TextStyle(fontWeight: FontWeight.w700)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          if (_error != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: scheme.errorContainer,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(_error!,
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(color: scheme.onErrorContainer)),
            ),
          ],
          const SizedBox(height: 12),
          if (_balanced && _debitTotal > 0)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                'Balanced: ₹${money(_debitTotal)} on each side.',
                style: TextStyle(color: scheme.primary),
              ),
            ),
        ],
      ),
    );
  }

  String _isoDate(DateTime d) {
    final m = d.month.toString().padLeft(2, '0');
    final day = d.day.toString().padLeft(2, '0');
    return '${d.year}-$m-$day';
  }

  String _money(double v) {
    if (v == v.roundToDouble()) return v.toStringAsFixed(0);
    return v.toStringAsFixed(2);
  }
}