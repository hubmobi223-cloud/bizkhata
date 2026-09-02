import 'package:flutter/material.dart';

import '../formats.dart';
import '../labels.dart';
import '../models.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';
import 'voucher_detail_screen.dart';

class LedgerDetailScreen extends StatelessWidget {
  final Company company;
  final Ledger ledger;
  final double balance;

  const LedgerDetailScreen({
    super.key,
    required this.company,
    required this.ledger,
    required this.balance,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(ledger.name)),
      body: FutureBuilder<
          ({
            List<LedgerPosting> postings,
            double debitTotal,
            double creditTotal
          })>(
        future: _loadDetail(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return ErrorMessage(
              message: snapshot.error.toString(),
              onRetry: () async {},
            );
          }
          final data = snapshot.data!;
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Row(
                children: [
                  Expanded(
                    child: Card(
                      elevation: 0,
                      color: Theme.of(context).colorScheme.surfaceContainerLow,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14)),
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Current balance',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodySmall
                                    ?.copyWith(
                                        color: Theme.of(context)
                                            .colorScheme
                                            .onSurfaceVariant)),
                            const SizedBox(height: 4),
                            Text(
                              '₹${money(balance)} ${balance >= 0 ? 'Dr' : 'Cr'}',
                              style: Theme.of(context)
                                  .textTheme
                                  .titleLarge
                                  ?.copyWith(fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Ledger statement',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (data.postings.isEmpty)
                const EmptyState(
                    message: 'No postings for this ledger yet.',
                    icon: Icons.account_balance)
              else
                Card(
                  elevation: 0,
                  margin: EdgeInsets.zero,
                  color: Theme.of(context).colorScheme.surfaceContainerLow,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  child: Column(
                    children: data.postings
                        .map((posting) => ListTile(
                              dense: true,
                              title: Text(
                                '${shortDate(parseIso(posting.voucherDate) ?? DateTime.now())} '
                                '· ${posting.voucherNumber}',
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600),
                              ),
                              subtitle: Text(
                                voucherTypeLabels[posting.voucherType] ??
                                    posting.voucherType,
                                maxLines: 1,
                              ),
                              trailing: Text(
                                posting.debit > 0
                                    ? 'Dr ₹${money(posting.debit)}'
                                    : 'Cr ₹${money(posting.credit)}',
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  color: posting.debit > 0
                                      ? Theme.of(context).colorScheme.onSurface
                                      : Theme.of(context)
                                          .colorScheme
                                          .onSurfaceVariant,
                                ),
                              ),
                              onTap: () => Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => VoucherDetailScreen(
                                    voucherId: posting.voucherId,
                                    company: company,
                                  ),
                                ),
                              ),
                            ))
                        .toList(),
                  ),
                ),
              const SizedBox(height: 12),
              Text(
                'Dr total ₹${money(data.debitTotal)} · Cr total ₹${money(data.creditTotal)}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          );
        },
      ),
    );
  }

  Future<({List<LedgerPosting> postings, double debitTotal, double creditTotal})>
  _loadDetail() async {
    final res = await AppState.instance.api
        .ledgerPostings(company.id, ledger.id);
    var debitTotal = 0.0;
    var creditTotal = 0.0;
    for (final p in res) {
      debitTotal += p.debit;
      creditTotal += p.credit;
    }
    return (postings: res, debitTotal: debitTotal, creditTotal: creditTotal);
  }
}