import 'package:flutter/material.dart';

import '../models.dart';
import '../services/app_state.dart';
import '../services/auth_service.dart';
import 'billing_screen.dart';
import 'home_screen.dart';
import 'items_screen.dart';
import 'ledgers_screen.dart';
import 'vouchers_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _index = 0;

  Future<void> _switchCompany() async {
    final state = AppState.instance;
    final selected = await showModalBottomSheet<String>(
      context: context,
      showDragHandle: true,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
              child: Text('Switch company',
                  style: Theme.of(context).textTheme.titleMedium),
            ),
            ...state.companies.map((Company c) => ListTile(
                  leading: const Icon(Icons.business),
                  title: Text(c.name),
                  subtitle: c.stateCode == null
                      ? null
                      : Text('State ${c.stateCode}'),
                  trailing: c.id == state.company?.id
                      ? const Icon(Icons.check_circle)
                      : null,
                  onTap: () => Navigator.of(context).pop(c.id),
                )),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
    if (selected == null) return;
    final company = state.companies.firstWhere((c) => c.id == selected);
    await state.selectCompany(company);
  }

  Future<void> _signOut() async {
    await AuthService().signOut();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: AppState.instance,
      builder: (context, child) {
        final state = AppState.instance;
        final company = state.company;
        if (company == null) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        final scopeKey = ValueKey<String>(
            '${company.id}:${state.fy?.id ?? 'no-fy'}:${state.revision}');

        final pages = <Widget>[
          HomePage(
            key: scopeKey,
            company: company,
            onNavigate: (index) => setState(() => _index = index),
          ),
          LedgersPage(key: scopeKey, company: company),
          VouchersPage(key: scopeKey, company: company),
          ItemsPage(key: scopeKey, company: company),
          BillingPage(key: scopeKey, company: company),
        ];

        return Scaffold(
          appBar: AppBar(
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(company.name,
                    style: Theme.of(context)
                        .textTheme
                        .titleMedium
                        ?.copyWith(fontWeight: FontWeight.w700)),
                if (state.fy != null)
                  Text('FY ${state.fy!.name}',
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(
                              color: Theme.of(context).colorScheme.onSurfaceVariant)),
              ],
            ),
            actions: [
              IconButton(
                onPressed: _switchCompany,
                tooltip: 'Switch company',
                icon: const Icon(Icons.swap_horiz),
              ),
              PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'signout') _signOut();
                },
                itemBuilder: (context) => const [
                  PopupMenuItem(value: 'signout', child: Text('Sign out')),
                ],
              ),
            ],
          ),
          body: IndexedStack(
            index: _index,
            children: pages,
          ),
          bottomNavigationBar: NavigationBar(
            selectedIndex: _index,
            onDestinationSelected: (index) => setState(() => _index = index),
            destinations: const [
              NavigationDestination(
                icon: Icon(Icons.dashboard_outlined),
                selectedIcon: Icon(Icons.dashboard),
                label: 'Home',
              ),
              NavigationDestination(
                icon: Icon(Icons.account_balance_outlined),
                selectedIcon: Icon(Icons.account_balance),
                label: 'Ledgers',
              ),
              NavigationDestination(
                icon: Icon(Icons.receipt_long_outlined),
                selectedIcon: Icon(Icons.receipt_long),
                label: 'Vouchers',
              ),
              NavigationDestination(
                icon: Icon(Icons.inventory_2_outlined),
                selectedIcon: Icon(Icons.inventory_2),
                label: 'Items',
              ),
              NavigationDestination(
                icon: Icon(Icons.point_of_sale_outlined),
                selectedIcon: Icon(Icons.point_of_sale),
                label: 'Billing',
              ),
            ],
          ),
        );
      },
    );
  }
}