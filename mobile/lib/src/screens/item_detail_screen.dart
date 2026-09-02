import 'package:flutter/material.dart';

import '../formats.dart';
import '../labels.dart';
import '../models.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';
import 'voucher_detail_screen.dart';

class ItemDetailScreen extends StatelessWidget {
  final Company company;
  final Item item;

  const ItemDetailScreen({
    super.key,
    required this.company,
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(item.name)),
      body: FutureBuilder<
          ({
            List<StockBalance> balances,
            List<Batch> batches,
            List<StockBookRow> book,
          })>(
        future: _load(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return ErrorMessage(message: snapshot.error.toString());
          }
          final data = snapshot.data!;
          final totalQty =
              data.balances.fold<double>(0, (sum, b) => sum + b.qty);
          final totalValue =
              data.balances.fold<double>(0, (sum, b) => sum + b.value);

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: 1.5,
                children: [
                  Card(
                    elevation: 0,
                    color: Theme.of(context).colorScheme.surfaceContainerLow,
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Stock in hand',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onSurfaceVariant)),
                          Text('${qty(totalQty)} ${item.unitName ?? ''}',
                              style: Theme.of(context).textTheme.titleMedium
                                  ?.copyWith(fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                  ),
                  Card(
                    elevation: 0,
                    color: Theme.of(context).colorScheme.surfaceContainerLow,
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Inventory value',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onSurfaceVariant)),
                          Text('₹${money(totalValue)}',
                              style: Theme.of(context).textTheme.titleMedium
                                  ?.copyWith(fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Card(
                elevation: 0,
                margin: EdgeInsets.zero,
                color: Theme.of(context).colorScheme.surfaceContainerLow,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      InfoRow(label: 'Code',
                          value: item.code ?? '—'),
                      InfoRow(label: 'HSN/SAC',
                          value: item.hsnSac ?? '—'),
                      InfoRow(label: 'GST rate',
                          value: '${_money0(item.gstRate)}%'),
                      InfoRow(label: 'Type',
                          value: itemTypeLabels[item.itemType] ?? item.itemType),
                      InfoRow(label: 'Unit',
                          value: '${item.unitName ?? ''}${item.unitUqc == null ? '' : ' (${item.unitUqc})'}'),
                      InfoRow(label: 'Category',
                          value: item.categoryName ?? '—'),
                      InfoRow(label: 'Valuation',
                          value: item.valuationMethod == 'fifo'
                              ? 'FIFO'
                              : 'Weighted average'),
                      InfoRow(label: 'Tracking',
                          value: [
                            if (item.batchTracking) 'Batch',
                            if (item.expiryTracking) 'Expiry',
                          ].join(', ')),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              if (data.batches.isNotEmpty) ...[
                Text('Batches',
                    style: Theme.of(context).textTheme.titleSmall),
                const SizedBox(height: 8),
                Card(
                  elevation: 0,
                  margin: EdgeInsets.zero,
                  color: Theme.of(context).colorScheme.surfaceContainerLow,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  child: Column(
                    children: data.batches
                        .map((batch) => ListTile(
                              dense: true,
                              title: Text(batch.batchNo),
                              subtitle: Text(_batchSubtitle(batch)),
                              trailing: Text(
                                _statusLabel(batch.status),
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ))
                        .toList(),
                  ),
                ),
              ],
              const SizedBox(height: 16),
              Text('Stock book', style: Theme.of(context).textTheme.titleSmall),
              const SizedBox(height: 8),
              if (data.book.isEmpty)
                const EmptyState(message: 'No stock movements yet.')
              else
                Card(
                  elevation: 0,
                  margin: EdgeInsets.zero,
                  color: Theme.of(context).colorScheme.surfaceContainerLow,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  child: Column(
                    children: data.book
                        .map((row) => ListTile(
                              dense: true,
                              leading: Icon(
                                row.movement == 'in'
                                    ? Icons.south
                                    : Icons.north,
                                size: 18,
                                color: row.movement == 'in'
                                    ? Colors.green.shade600
                                    : Theme.of(context).colorScheme.error,
                              ),
                              title: Text(
                                '${shortDate(parseIso(row.stockDate) ?? DateTime.now())} '
                                '· ${voucherTypeLabels[row.voucherType] ?? row.voucherType ?? '—'}',
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600),
                              ),
                              subtitle: Text(
                                '${row.movement == 'in' ? qty(row.inwardQty) : '−${qty(row.outwardQty)}'} '
                                '@ ₹${money(row.rate)}'
                                '${(row.batchNo.isEmpty) ? '' : ' · ${row.batchNo}'}',
                              ),
                              trailing: Text(
                                'Bal ${qty(row.balanceQty)} · ₹${money(row.balanceValue)}',
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                              onTap:
                                  row.voucherId == null
                                      ? null
                                      : () => Navigator.of(context).push(
                                          MaterialPageRoute(
                                            builder: (_) =>
                                                VoucherDetailScreen(
                                                  voucherId: row.voucherId!,
                                                  company: company,
                                                ),
                                          ),
                                        ),
                            ))
                        .toList(),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }

  Future<({List<StockBalance> balances, List<Batch> batches, List<StockBookRow> book})>
  _load() async {
    final api = AppState.instance.api;
    final results = await Future.wait([
      api.stockBalance(companyId: company.id, itemId: item.id),
      api.batches(companyId: company.id, itemId: item.id),
      api.stockBook(companyId: company.id, itemId: item.id),
    ]);
    return (
      balances: results[0] as List<StockBalance>,
      batches: results[1] as List<Batch>,
      book: results[2] as List<StockBookRow>,
    );
  }

  String _batchSubtitle(Batch batch) {
    final parts = <String>[];
    if (batch.mfgDate != null && batch.mfgDate!.isNotEmpty) {
      parts.add('Mfg ${shortDate(parseIso(batch.mfgDate) ?? DateTime.now())}');
    }
    if (batch.expiryDate != null && batch.expiryDate!.isNotEmpty) {
      parts.add('Exp ${shortDate(parseIso(batch.expiryDate) ?? DateTime.now())}');
    }
    return parts.join(' · ');
  }

  String _statusLabel(String status) =>
      status == 'closed' ? 'Closed' : 'Open';

  String _money0(double value) {
    if (value == value.roundToDouble()) return value.toStringAsFixed(0);
    return value.toStringAsFixed(2);
  }
}