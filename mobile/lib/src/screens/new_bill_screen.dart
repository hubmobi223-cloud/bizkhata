import 'package:flutter/material.dart';

import '../formats.dart';
import '../gst.dart';
import '../models.dart';
import '../services/api.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';
import '../widgets/pickers.dart';

class _BillLine {
  String? itemId;
  String qty = '1';
  String rate = '';
  String discount = '0';
}

class NewBillScreen extends StatefulWidget {
  final Company company;
  final String mode;

  const NewBillScreen({super.key, required this.company, required this.mode});

  @override
  State<NewBillScreen> createState() => _NewBillScreenState();
}

class _NewBillScreenState extends State<NewBillScreen> {
  final _invoiceNo = TextEditingController();
  final _narration = TextEditingController();
  final _placeOfSupply = TextEditingController();
  final _settleAmount = TextEditingController(text: '0');
  DateTime _date = DateTime.now();
  String? _partyId;
  String? _settleLedgerId;
  final List<_BillLine> _lines = [_BillLine()];
  bool _loading = true;
  bool _busy = false;
  String? _error;

  List<Ledger> _parties = const [];
  List<Ledger> _cashBanks = const [];
  List<Item> _items = const [];
  Ledger? _sales;
  Ledger? _purchase;
  Ledger? _cgstOut;
  Ledger? _sgstOut;
  Ledger? _igstOut;
  Ledger? _cgstIn;
  Ledger? _sgstIn;
  Ledger? _igstIn;

  bool get _isSales => widget.mode == 'sales';

  @override
  void initState() {
    super.initState();
    _load().then((_) {
      if (mounted) {
        setState(() {
          _loading = false;
          if (_cashBanks.isNotEmpty) {
            _settleLedgerId = _cashBanks.first.id;
          }
        });
      }
    }).catchError((Object e) {
      if (mounted) {
        setState(() {
          _loading = false;
          _error = e is Exception ? e.toString() : 'Could not load billing data';
        });
      }
    });
  }

  Future<void> _load() async {
    final api = AppState.instance.api;
    final ledgers = await api.billingLedgers(widget.company.id);
    final items = await api.items(widget.company.id);
    _parties = ledgers.parties;
    _cashBanks = ledgers.cashBanks;
    _items = items;
    _sales = ledgers.sales;
    _purchase = ledgers.purchase;
    _cgstOut = ledgers.cgstOut;
    _sgstOut = ledgers.sgstOut;
    _igstOut = ledgers.igstOut;
    _cgstIn = ledgers.cgstIn;
    _sgstIn = ledgers.sgstIn;
    _igstIn = ledgers.igstIn;
  }

  Ledger? get _party => _ledgerById(_parties, _partyId);

  String get _effectiveState =>
      _party?.stateCode ?? widget.company.stateCode ?? '';

  String get _supplyState {
    final v = _placeOfSupply.text.trim().toUpperCase();
    return v.isNotEmpty ? v : _effectiveState;
  }

  bool get _intra =>
      _supplyState.isNotEmpty && _supplyState == widget.company.stateCode;

  Item? _itemOf(_BillLine line) => _itemById(_items, line.itemId);

  _LineCompute _compute(_BillLine line) {
    final item = _itemOf(line);
    final qty = double.tryParse(line.qty) ?? 0;
    final rate = double.tryParse(line.rate) ?? 0;
    final discount = double.tryParse(line.discount) ?? 0;
    final taxable = taxableValue(qty, rate, discount);
    final split = splitTax(taxable, item?.gstRate ?? 0, _intra);
    return _LineCompute(
      item: item,
      qty: qty,
      rate: rate,
      discount: discount,
      taxable: taxable,
      split: split,
      total: round2(taxable + split.total),
    );
  }

  _Totals get _totals {
    var taxable = 0.0, cgst = 0.0, sgst = 0.0, igst = 0.0;
    for (final line in _lines) {
      final c = _compute(line);
      taxable = round2(taxable + c.taxable);
      cgst = round2(cgst + c.split.cgst);
      sgst = round2(sgst + c.split.sgst);
      igst = round2(igst + c.split.igst);
    }
    return _Totals(taxable: taxable, cgst: cgst, sgst: sgst, igst: igst);
  }

  double get _grand {
    final t = _totals;
    return round2(t.taxable + t.cgst + t.sgst + t.igst);
  }

  Future<void> _pickParty() async {
    final id = await pickItem<Ledger>(
      context,
      title: 'Select party',
      items: _parties,
      idOf: (l) => l.id,
      labelOf: (l) => l.name,
      codeOf: (l) => l.stateCode ?? '',
      selectedId: _partyId,
    );
    if (id != null) {
      setState(() {
        _partyId = id;
        _placeOfSupply.clear();
      });
    }
  }

  Future<void> _pickItem(_BillLine line) async {
    final options = _items
        .where((i) => _isSales ? i.isSellable : i.isPurchasable)
        .toList();
    final id = await pickItem<Item>(
      context,
      title: 'Add item',
      items: options,
      idOf: (i) => i.id,
      labelOf: (i) => i.name,
      codeOf: (i) => i.hsnSac ?? '',
      selectedId: line.itemId,
    );
    if (id != null) setState(() => line.itemId = id);
  }

  Future<void> _pickSettleLedger() async {
    final id = await pickItem<Ledger>(
      context,
      title: 'Cash/Bank account',
      items: _cashBanks,
      idOf: (l) => l.id,
      labelOf: (l) => l.name,
      selectedId: _settleLedgerId,
    );
    if (id != null) setState(() => _settleLedgerId = id);
  }

  Future<void> _post() async {
    final computed = _lines.map(_compute).toList();
    final totals = _totals;
    final grand = _grand;
    final settled = double.tryParse(_settleAmount.text) ?? 0;
    final balance = round2(grand - settled);

    if (_partyId == null) {
      _showError('Select a party');
      return;
    }
    if (_supplyState.length != 2) {
      _showError('Place of supply must be a 2-letter state code');
      return;
    }
    final hasValid = computed.any((c) => c.item != null && c.qty > 0 && c.rate >= 0);
    if (!hasValid) {
      _showError('Add at least one line with quantity and rate');
      return;
    }
    if (computed.any((c) => c.rate < 0)) {
      _showError('Rate cannot be negative');
      return;
    }
    if (computed.any((c) => c.discount > c.qty * c.rate + 0.005)) {
      _showError('Discount on a line cannot exceed its value');
      return;
    }
    if (totals.taxable <= 0) {
      _showError('Taxable value should be greater than zero');
      return;
    }
    if (grand <= 0) {
      _showError('Bill total must be greater than zero');
      return;
    }
    if (settled > 0 && _settleLedgerId == null) {
      _showError('Select a cash/bank ledger for the settlement');
      return;
    }
    if (settled > grand + 0.005) {
      _showError('Settlement amount cannot exceed the bill total');
      return;
    }

    final missing = _isSales
        ? (_sales == null || _cgstOut == null || _sgstOut == null || _igstOut == null)
        : (_purchase == null ||
            _cgstIn == null ||
            _sgstIn == null ||
            _igstIn == null);
    if (missing) {
      _showError(
          'Missing billing ledgers. Ensure ${_isSales ? 'Sales A/c and GST output' : 'Purchase A/c and GST input'} ledgers exist.');
      return;
    }

    final itemsPayload = <Map<String, dynamic>>[];
    for (final c in computed) {
      if (c.item == null || c.qty <= 0) continue;
      itemsPayload.add({
        'item_id': c.item!.id,
        'unit_id': c.item!.unitId,
        'qty': c.qty,
        'rate': c.rate,
        'discount': c.discount,
        'taxable_value': c.taxable,
        'gst_rate': c.item!.gstRate,
        'cgst': c.split.cgst,
        'sgst': c.split.sgst,
        'igst': c.split.igst,
      });
    }

    final entries = _buildEntries(
      isSales: _isSales,
      partyId: _partyId!,
      grand: grand,
      settled: settled,
      balance: balance,
      settleLedgerId: _settleLedgerId,
      taxable: totals.taxable,
      cgst: totals.cgst,
      sgst: totals.sgst,
      igst: totals.igst,
      salesA: _sales!.id,
      purchaseA: _purchase!.id,
      cgstOut: _cgstOut!.id,
      sgstOut: _sgstOut!.id,
      igstOut: _igstOut!.id,
      cgstIn: _cgstIn!.id,
      sgstIn: _sgstIn!.id,
      igstIn: _igstIn!.id,
    );

    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final fyId = AppState.instance.fy?.id;
      if (fyId == null) throw const BizKhataException('No active financial year');
      final iso = _isoDate(_date);
      final voucherId = await AppState.instance.api.postBill(
        companyId: widget.company.id,
        fyId: fyId,
        type: _isSales ? 'sales' : 'purchase',
        date: iso,
        invoiceNo: _invoiceNo.text,
        placeOfSupply: _supplyState,
        narration: _narration.text,
        partyLedgerId: _partyId!,
        entries: entries,
        items: itemsPayload,
      );
      AppState.instance.bump();
      if (mounted) {
        Navigator.of(context).pop(voucherId);
      }
    } on BizKhataException catch (e) {
      if (mounted) setState(() => _error = e.message);
    } catch (_) {
      if (mounted) setState(() => _error = 'Could not post bill');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        title: Text(_isSales ? 'New sales invoice' : 'New purchase bill'),
        actions: [
          TextButton(
            onPressed: _busy || _loading ? null : _post,
            child: const Text('Post'),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null && _parties.isEmpty
              ? ErrorMessage(message: _error!)
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    FieldButton(
                      label: 'Party',
                      value: _party?.name,
                      onTap: _pickParty,
                      error: _partyId == null,
                    ),
                    if (_party != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          'State: ${_party!.stateCode ?? '—'} · GSTIN: ${_party!.gstin ?? '—'}',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ),
                    const SizedBox(height: 12),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _placeOfSupply,
                            maxLength: 2,
                            textCapitalization: TextCapitalization.characters,
                            decoration: const InputDecoration(
                              labelText: 'Place of supply',
                              hintText: 'e.g. 27',
                              counterText: '',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (v) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _invoiceNo,
                            decoration: InputDecoration(
                              labelText:
                                  _isSales ? 'Invoice no.' : 'Bill no.',
                              border: const OutlineInputBorder(),
                            ),
                          ),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 6, bottom: 4),
                      child: Text(
                        _intra
                            ? 'Intra-state → CGST + SGST'
                            : 'Inter-state → IGST',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: scheme.primary,
                            ),
                      ),
                    ),
                    OutlinedButton.icon(
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
                    const SizedBox(height: 12),
                    TextField(
                      controller: _narration,
                      decoration: InputDecoration(
                        labelText: 'Narration (optional)',
                        border: const OutlineInputBorder(),
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
                          for (final line in _lines)
                            _buildLine(context, line),
                          Padding(
                            padding: const EdgeInsets.all(8),
                            child: Row(
                              children: [
                                TextButton.icon(
                                  onPressed: () =>
                                      setState(() => _lines.add(_BillLine())),
                                  icon: const Icon(Icons.add, size: 18),
                                  label: const Text('Add item'),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _settleAmount,
                            keyboardType: const TextInputType
                                .numberWithOptions(decimal: true),
                            decoration: InputDecoration(
                              labelText: _isSales
                                  ? 'Payment received'
                                  : 'Payment made',
                              border: const OutlineInputBorder(),
                            ),
                            onChanged: (v) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: InkWell(
                            onTap: _pickSettleLedger,
                            borderRadius: BorderRadius.circular(10),
                            child: InputDecorator(
                              decoration: const InputDecoration(
                                labelText: 'Cash/Bank',
                                border: OutlineInputBorder(),
                              ),
                              child: Text(
                                _ledgerById(_cashBanks, _settleLedgerId)?.name ??
                                    'Select…',
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildTotals(context),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: _busy ? null : _post,
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: _busy
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : Text(_isSales
                              ? 'Post sales invoice'
                              : 'Post purchase bill'),
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
                  ],
                ),
    );
  }

  Widget _buildLine(BuildContext context, _BillLine line) {
    final c = _compute(line);
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            onTap: () => _pickItem(line),
            borderRadius: BorderRadius.circular(8),
            child: InputDecorator(
              decoration: InputDecoration(
                labelText: 'Item',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      c.item?.name ?? 'Add item…',
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (c.item != null)
                    Text(
                      '${_money0(c.item!.gstRate)}%',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                ],
              ),
            ),
          ),
          if (c.item != null)
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Text(
                '${c.item!.unitName ?? ''} · HSN ${c.item!.hsnSac ?? '—'}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
          const SizedBox(height: 8),
          Row(
            children: [
              _field('Qty', line.qty, (v) => line.qty = v),
              const SizedBox(width: 8),
              _field('Rate', line.rate, (v) => line.rate = v),
              const SizedBox(width: 8),
              _field('Disc', line.discount, (v) => line.discount = v),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: Text(
                  'Taxable ₹${money(c.taxable)} · Tax ₹${money(c.split.total)}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
              Text(
                '₹${money(c.total)}',
                style:
                    const TextStyle(fontWeight: FontWeight.w700),
              ),
              if (_lines.length > 1) ...[
                const SizedBox(width: 4),
                IconButton(
                  visualDensity: VisualDensity.compact,
                  onPressed: () => setState(() => _lines.remove(line)),
                  icon: const Icon(Icons.delete_outline, size: 20),
                  color: scheme.error,
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _field(String label, String value, void Function(String) onChange) {
    return Expanded(
      child: TextFormField(
        initialValue: value,
        keyboardType:
            const TextInputType.numberWithOptions(decimal: true),
        decoration: InputDecoration(
          labelText: label,
          isDense: true,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        onChanged: (v) => setState(() => onChange(v)),
      ),
    );
  }

  Widget _buildTotals(BuildContext context) {
    final t = _totals;
    final settled = double.tryParse(_settleAmount.text) ?? 0;
    final scheme = Theme.of(context).colorScheme;
    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      color: scheme.surfaceContainerLow,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            InfoRow(label: 'Taxable', value: '₹${money(t.taxable)}'),
            InfoRow(label: 'CGST', value: '₹${money(t.cgst)}'),
            InfoRow(label: 'SGST', value: '₹${money(t.sgst)}'),
            InfoRow(label: 'IGST', value: '₹${money(t.igst)}'),
            const Divider(height: 20),
            InfoRow(label: 'Grand total', value: '₹${money(_grand)}', emphasized: true),
            if (settled > 0) ...[
              InfoRow(
                  label: 'Settled',
                  value: '₹${money(settled)}',
                  emphasized: true),
              InfoRow(
                  label: 'Due on party',
                  value: '₹${money(round2(_grand - settled))}',
                  emphasized: true),
            ],
          ],
        ),
      ),
    );
  }

  List<Map<String, dynamic>> _buildEntries({
    required bool isSales,
    required String partyId,
    required double grand,
    required double settled,
    required double balance,
    String? settleLedgerId,
    required double taxable,
    required double cgst,
    required double sgst,
    required double igst,
    required String salesA,
    required String purchaseA,
    required String cgstOut,
    required String sgstOut,
    required String igstOut,
    required String cgstIn,
    required String sgstIn,
    required String igstIn,
  }) {
    final entries = <Map<String, dynamic>>[];
    void push(String ledgerId, double debit, double credit) {
      if (debit > 0 || credit > 0) {
        entries.add({'ledger_id': ledgerId, 'debit': debit, 'credit': credit});
      }
    }

    if (isSales) {
      if (settled > 0 && settleLedgerId != null) {
        push(settleLedgerId, settled, 0);
      }
      push(partyId, balance, 0);
      push(salesA, 0, taxable);
      push(cgstOut, 0, cgst);
      push(sgstOut, 0, sgst);
      push(igstOut, 0, igst);
    } else {
      push(purchaseA, taxable, 0);
      push(cgstIn, cgst, 0);
      push(sgstIn, sgst, 0);
      push(igstIn, igst, 0);
      if (settled > 0 && settleLedgerId != null) {
        push(settleLedgerId, 0, settled);
      }
      push(partyId, 0, balance);
    }
    return entries;
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  String _isoDate(DateTime d) {
    final m = d.month.toString().padLeft(2, '0');
    final day = d.day.toString().padLeft(2, '0');
    return '${d.year}-$m-$day';
  }

  String _money0(double value) {
    if (value == value.roundToDouble()) return value.toStringAsFixed(0);
    return value.toStringAsFixed(2);
  }
}

class _LineCompute {
  final Item? item;
  final double qty;
  final double rate;
  final double discount;
  final double taxable;
  final TaxSplit split;
  final double total;

  const _LineCompute({
    required this.item,
    required this.qty,
    required this.rate,
    required this.discount,
    required this.taxable,
    required this.split,
    required this.total,
  });
}

class _Totals {
  final double taxable;
  final double cgst;
  final double sgst;
  final double igst;

  const _Totals({
    required this.taxable,
    required this.cgst,
    required this.sgst,
    required this.igst,
  });
}

Ledger? _ledgerById(List<Ledger> list, String? id) {
  if (id == null) return null;
  for (final l in list) {
    if (l.id == id) return l;
  }
  return null;
}

Item? _itemById(List<Item> list, String? id) {
  if (id == null) return null;
  for (final i in list) {
    if (i.id == id) return i;
  }
  return null;
}