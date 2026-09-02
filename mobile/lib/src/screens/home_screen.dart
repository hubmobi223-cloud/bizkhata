import 'package:flutter/material.dart';

import '../formats.dart';
import '../labels.dart';
import '../models.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';
import 'voucher_detail_screen.dart';

class HomePage extends StatelessWidget {
  final Company company;
  final void Function(int index)? onNavigate;

  const HomePage({super.key, required this.company, this.onNavigate});

  Future<({List<Ledger> ledgers, List<TrialBalanceRow> trial, List<DayBookRow> recent, int ledgerCount, int itemCount, int voucherCount, double stockValue})>
  _load() async {
    final api = AppState.instance.api;
    final fyId = AppState.instance.fy?.id;
    return (
      ledgers: await api.ledgers(company.id),
      trial: await api.trialBalance(company.id),
      recent: await api.dayBook(
          companyId: company.id, fyId: fyId, limit: 6),
      ledgerCount: await api.countActiveLedgers(company.id),
      itemCount: await api.countActiveItems(company.id),
      voucherCount: fyId == null
          ? 0
          : await api.countPostedVouchers(company.id, fyId),
      stockValue: await api.stockValue(company.id),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: RemoteView<
          ({
            List<Ledger> ledgers,
            List<TrialBalanceRow> trial,
            List<DayBookRow> recent,
            int ledgerCount,
            int itemCount,
            int voucherCount,
            double stockValue
          })>(loader: _load, builder: (context, data) {
        final netByLedger = <String, double>{
          for (final row in data.trial) row.ledgerId: row.netBalance,
        };
        final cashBank = data.ledgers
            .where((l) => l.isCashBank)
            .fold<double>(0, (sum, l) => sum + (netByLedger[l.id] ?? 0));
        final debtors = data.trial
            .where((r) => r.groupName == 'Sundry Debtors')
            .fold<double>(0, (sum, r) => sum + r.netBalance);
        final creditors = data.trial
            .where((r) => r.groupName == 'Sundry Creditors')
            .fold<double>(0, (sum, r) => sum + r.netBalance);
        final income = data.trial
            .where((r) => r.groupType == 'income')
            .fold<double>(0, (sum, r) => sum + r.netBalance);
        final expenses = data.trial
            .where((r) => r.groupType == 'expense')
            .fold<double>(0, (sum, r) => sum + r.netBalance);
        final netProfit = -income - expenses;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
              child: Text(
                'Financial overview',
                style: Theme.of(context).textTheme.titleSmall,
              ),
            ),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 1.35,
              children: [
                AmountTile(
                  label: 'Cash & Bank',
                  value: cashBank,
                  icon: Icons.wallet,
                  onTap: () => _openAccounts(context),
                ),
                AmountTile(
                  label: 'Debtors (receivable)',
                  value: debtors,
                  icon: Icons.people,
                  onTap: () => _openAccounts(context),
                ),
                AmountTile(
                  label: 'Creditors (payable)',
                  value: creditors == 0 ? 0 : -creditors,
                  icon: Icons.account_balance_wallet,
                  onTap: () => _openAccounts(context),
                ),
                AmountTile(
                  label: netProfit >= 0 ? 'Net profit (YTD)' : 'Net loss (YTD)',
                  value: netProfit,
                  icon: netProfit >= 0
                      ? Icons.trending_up
                      : Icons.trending_down,
                  negative: netProfit < 0,
                ),
                AmountTile(
                  label: 'Inventory value',
                  value: data.stockValue,
                  icon: Icons.inventory_2,
                  onTap: () => _openIndex(context, 3),
                ),
                AmountTile(
                  label: 'Ledgers',
                  value: data.ledgerCount.toDouble(),
                  icon: Icons.account_balance,
                  onTap: () => _openIndex(context, 1),
                ),
                AmountTile(
                  label: 'Active items',
                  value: data.itemCount.toDouble(),
                  icon: Icons.category,
                  onTap: () => _openIndex(context, 3),
                ),
                AmountTile(
                  label: 'Vouchers posted',
                  value: data.voucherCount.toDouble(),
                  icon: Icons.receipt_long,
                  onTap: () => _openIndex(context, 2),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: SectionHeader(
                title: 'Recent vouchers',
                action: TextButton(
                  onPressed: () => _openIndex(context, 2),
                  child: const Text('View all'),
                ),
              ),
            ),
            if (data.recent.isEmpty)
              const EmptyState(message: 'No vouchers yet.', icon: Icons.event)
            else
              Card(
                elevation: 0,
                margin: const EdgeInsets.symmetric(horizontal: 16),
                color: Theme.of(context).colorScheme.surfaceContainerLow,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: data.recent
                      .map((row) => ListTile(
                            dense: true,
                            title: Text(
                              voucherTypeLabels[row.voucherType] ?? row.voucherType,
                              style: const TextStyle(fontWeight: FontWeight.w600),
                            ),
                            subtitle: Text(
                              '${shortDate(parseIso(row.voucherDate) ?? DateTime.now())} · '
                              '${row.partyName ?? row.narration ?? row.voucherNumber}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            trailing: Text(
                              '₹${money((row.debit - row.credit).abs())}',
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600),
                            ),
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => VoucherDetailScreen(
                                    voucherId: row.id, company: company),
                              ),
                            ),
                          ))
                      .toList(),
                ),
              ),
          ],
        );
      }),
    );
  }

  void _openAccounts(BuildContext context) => _openIndex(context, 1);

  void _openIndex(BuildContext context, int index) {
    onNavigate?.call(index);
  }
}