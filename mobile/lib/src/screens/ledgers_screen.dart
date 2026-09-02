import 'package:flutter/material.dart';

import '../formats.dart';
import '../labels.dart';
import '../models.dart';
import '../services/api.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';
import '../widgets/pickers.dart';
import 'ledger_detail_screen.dart';

class LedgersPage extends StatefulWidget {
  final Company company;

  const LedgersPage({super.key, required this.company});

  @override
  State<LedgersPage> createState() => _LedgersPageState();
}

class _LedgersPageState extends State<LedgersPage> {
  List<AccountGroup> _groups = const [];
  List<Ledger> _ledgers = const [];
  Map<String, double> _balances = {};
  bool _loading = true;
  String? _error;
  String _filter = 'all';
  String _query = '';

  @override
  void initState() {
    super.initState();
    _reload();
  }

  Future<void> _reload() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final api = AppState.instance.api;
      final groups = await api.accountGroups(widget.company.id);
      final ledgers = await api.ledgers(widget.company.id);
      final trial = await api.trialBalance(widget.company.id);
      final balances = <String, double>{
        for (final row in trial) row.ledgerId: row.netBalance,
      };
      if (!mounted) return;
      setState(() {
        _groups = groups;
        _ledgers = ledgers;
        _balances = balances;
        _loading = false;
      });
    } on BizKhataException catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.message;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Could not load chart of accounts';
        _loading = false;
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
                  child: Text('Chart of accounts',
                      style: Theme.of(context).textTheme.titleSmall),
                ),
                TextButton.icon(
                  onPressed: _loading ? null : _createGroup,
                  icon: const Icon(Icons.create_new_folder_outlined, size: 18),
                  label: const Text('Group'),
                ),
                TextButton.icon(
                  onPressed: _loading ? null : _createLedger,
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text('Ledger'),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search ledgers…',
                isDense: true,
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: (v) => setState(() => _query = v),
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                for (final (key, label) in const [
                  ('all', 'All'),
                  ('assets', 'Assets'),
                  ('liabilities', 'Liabilities'),
                  ('income', 'Income'),
                  ('expense', 'Expenses'),
                ])
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(label),
                      selected: _filter == key,
                      onSelected: (_) => setState(() => _filter = key),
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
    final query = _query.trim().toLowerCase();
    final visibleGroups = _groups
        .where((g) =>
            _filter == 'all' || g.groupType == _filter)
        .where((g) =>
            query.isEmpty ||
            g.name.toLowerCase().contains(query) ||
            _ledgers
                .where((l) => l.accountGroupId == g.id)
                .any((l) => l.name.toLowerCase().contains(query)))
        .toList();

    if (visibleGroups.isEmpty) {
      return const EmptyState(message: 'No ledgers found.', icon: Icons.book);
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      children: [
        for (final group in visibleGroups) ...[
          Padding(
            padding: const EdgeInsets.only(top: 12, bottom: 4),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    group.name,
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                          color: Theme.of(context).colorScheme.primary,
                        ),
                  ),
                ),
                if (group.isSummary)
                  Text(
                    groupTypeLabels[group.groupType] ?? '',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Theme.of(context).colorScheme.outline,
                        ),
                  ),
              ],
            ),
          ),
          Card(
            elevation: 0,
            margin: EdgeInsets.zero,
            color: Theme.of(context).colorScheme.surfaceContainerLow,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12)),
            child: Column(
              children: [
                for (final ledger
                    in _ledgers.where((l) => l.accountGroupId == group.id)
                        .where((l) =>
                            query.isEmpty ||
                            l.name.toLowerCase().contains(query)))
                  ListTile(
                    dense: true,
                    title: Text(ledger.name,
                        overflow: TextOverflow.ellipsis),
                    subtitle: ledger.code == null
                        ? null
                        : Text(ledger.code!,
                            style: Theme.of(context).textTheme.bodySmall),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          money(_balances[ledger.id] ?? 0),
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          (_balances[ledger.id] ?? 0) >= 0 ? 'Dr' : 'Cr',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => LedgerDetailScreen(
                          company: widget.company,
                          ledger: ledger,
                          balance: _balances[ledger.id] ?? 0,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Future<void> _createGroup() async {
    final nameController = TextEditingController();
    String type = 'assets';
    final created = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('New group'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                autofocus: true,
                decoration: const InputDecoration(
                  labelText: 'Group name',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: type,
                decoration: const InputDecoration(
                  labelText: 'Group type',
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: 'assets', child: Text('Assets')),
                  DropdownMenuItem(
                      value: 'liabilities', child: Text('Liabilities')),
                  DropdownMenuItem(value: 'income', child: Text('Income')),
                  DropdownMenuItem(value: 'expense', child: Text('Expenses')),
                ],
                onChanged: (v) => setDialogState(() => type = v ?? type),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
    if (created != true || nameController.text.trim().isEmpty) return;
    try {
      await AppState.instance.api.createGroup(
        companyId: widget.company.id,
        name: nameController.text.trim(),
        groupType: type,
      );
      await _reload();
    } on BizKhataException catch (e) {
      _showError(e.message);
    }
  }

  Future<void> _createLedger() async {
    if (_groups.isEmpty) {
      _showError('Create an account group first');
      return;
    }
    final nameController = TextEditingController();
    final codeController = TextEditingController();
    final openingController = TextEditingController();
    String? groupId;
    for (final g in _groups) {
      if (!g.isSummary && g.groupType == 'assets') {
        groupId = g.id;
        break;
      }
    }
    var party = false;
    var cashBank = false;

    final created = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) {
          final groupOptions = _groups
              .where((g) => !g.isSummary)
              .map((g) => PickerOption(id: g.id, label: g.name))
              .toList();
          return AlertDialog(
            title: const Text('New ledger'),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: nameController,
                    autofocus: true,
                    decoration: const InputDecoration(
                      labelText: 'Ledger name',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: codeController,
                    decoration: const InputDecoration(
                      labelText: 'Code (optional)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  InkWell(
                    onTap: () async {
                      final id = await pickOption(
                        context,
                        title: 'Account group',
                        options: groupOptions,
                        selectedId: groupId,
                      );
                      if (id != null) setDialogState(() => groupId = id);
                    },
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        labelText: 'Account group',
                        border: OutlineInputBorder(),
                      ),
                      child: Text(_groups
                              .firstWhere((g) => g.id == groupId,
                                  orElse: () => _groups.first)
                              .name),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: openingController,
                    keyboardType:
                        const TextInputType.numberWithOptions(decimal: true),
                    decoration: const InputDecoration(
                      labelText: 'Opening balance (optional)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 8),
                  CheckboxListTile(
                    value: party,
                    onChanged: (v) => setDialogState(() => party = v ?? false),
                    title: const Text('Party (customer/supplier)'),
                    dense: true,
                    controlAffinity: ListTileControlAffinity.leading,
                    contentPadding: EdgeInsets.zero,
                  ),
                  CheckboxListTile(
                    value: cashBank,
                    onChanged: (v) =>
                        setDialogState(() => cashBank = v ?? false),
                    title: const Text('Cash or bank account'),
                    dense: true,
                    controlAffinity: ListTileControlAffinity.leading,
                    contentPadding: EdgeInsets.zero,
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () => Navigator.of(context).pop(true),
                child: const Text('Create'),
              ),
            ],
          );
        },
      ),
    );
    if (created != true || nameController.text.trim().isEmpty) return;
    if (groupId == null) {
      _showError('Select an account group');
      return;
    }
    final opening = double.tryParse(openingController.text) ?? 0;
    try {
      await AppState.instance.api.createLedger(
        companyId: widget.company.id,
        accountGroupId: groupId!,
        name: nameController.text.trim(),
        code: codeController.text.trim().isEmpty ? null : codeController.text,
        openingDebit: opening > 0 ? opening : 0,
        openingCredit: opening < 0 ? -opening : 0,
        isParty: party,
        isCashBank: cashBank,
      );
      await _reload();
    } on BizKhataException catch (e) {
      _showError(e.message);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }
}