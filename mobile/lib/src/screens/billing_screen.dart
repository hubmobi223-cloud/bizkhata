import 'package:flutter/material.dart';

import '../formats.dart';
import '../labels.dart';
import '../models.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';
import 'new_bill_screen.dart';
import 'voucher_detail_screen.dart';

class BillingPage extends StatelessWidget {
  final Company company;

  const BillingPage({super.key, required this.company});

  Future<List<DayBookRow>> _load() => AppState.instance.api.dayBook(
        companyId: company.id,
        fyId: AppState.instance.fy?.id,
        limit: 10,
      );

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: RemoteView<List<DayBookRow>>(
        loader: _load,
        builder: (context, rows) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
                child: Text(
                  'Billing & GST invoices',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
              ),
              Row(
                children: [
                  Expanded(
                    child: _ActionCard(
                      icon: Icons.shopping_cart,
                      label: 'Sales',
                      subtitle: 'Customer invoice with GST',
                      color: Theme.of(context).colorScheme.primary,
                      onTap: () => _open(context, 'sales'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _ActionCard(
                      icon: Icons.shopping_bag,
                      label: 'Purchase',
                      subtitle: 'Supplier bill with GST input',
                      color: Theme.of(context).colorScheme.tertiary,
                      onTap: () => _open(context, 'purchase'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: SectionHeader(title: 'Recent bills', action: const SizedBox()),
              ),
              const SizedBox(height: 8),
              if (rows.isEmpty)
                const EmptyState(message: 'No bills yet.', icon: Icons.receipt)
              else
                Card(
                  elevation: 0,
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  color: Theme.of(context).colorScheme.surfaceContainerLow,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                  child: Column(
                    children: rows
                        .where((r) => const {
                              'sales',
                              'purchase',
                              'credit_note',
                              'debit_note'
                            }.contains(r.voucherType))
                        .take(8)
                        .map((row) => ListTile(
                              dense: true,
                              title: Text(
                                '${voucherTypeLabels[row.voucherType] ?? row.voucherType} '
                                '${row.voucherNumber}',
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600),
                              ),
                              subtitle: Text(
                                '${shortDate(parseIso(row.voucherDate) ?? DateTime.now())}'
                                '${row.partyName == null ? '' : ' · ${row.partyName}'}',
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
        },
      ),
    );
  }

  Future<void> _open(BuildContext context, String mode) async {
    await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => NewBillScreen(company: company, mode: mode),
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      color: color.withValues(alpha: 0.12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, size: 26, color: color),
              const SizedBox(height: 10),
              Text(label,
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: 2),
              Text(subtitle,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      )),
            ],
          ),
        ),
      ),
    );
  }
}