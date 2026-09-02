import 'package:flutter/material.dart';

import '../formats.dart';
import '../labels.dart';
import '../models.dart';
import '../services/api.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';
import '../widgets/pickers.dart';
import 'item_detail_screen.dart';

class ItemsPage extends StatefulWidget {
  final Company company;

  const ItemsPage({super.key, required this.company});

  @override
  State<ItemsPage> createState() => _ItemsPageState();
}

class _ItemsPageState extends State<ItemsPage> {
  List<Unit> _units = const [];
  List<ItemCategory> _categories = const [];
  List<Item> _items = const [];
  Map<String, ({double qty, double value})> _stock = {};
  bool _loading = true;
  String? _error;
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
      final units = await api.units(widget.company.id);
      final categories = await api.categories(widget.company.id);
      final items = await api.items(widget.company.id);
      final stock = await api.allStock(widget.company.id);
      if (!mounted) return;
      setState(() {
        _units = units;
        _categories = categories;
        _items = items;
        _stock = stock;
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
        _error = 'Could not load items';
        _loading = false;
      });
    }
  }

  double get _totalValue => _items.fold<double>(
      0, (sum, item) => sum + (_stock[item.id]?.value ?? 0));

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
                  child: Text('Items & inventory',
                      style: Theme.of(context).textTheme.titleSmall),
                ),
                TextButton.icon(
                  onPressed: _loading ? null : _createUnit,
                  icon: const Icon(Icons.straighten, size: 18),
                  label: const Text('Unit'),
                ),
                TextButton.icon(
                  onPressed: _loading ? null : _createCategory,
                  icon: const Icon(Icons.category_outlined, size: 18),
                  label: const Text('Category'),
                ),
                TextButton.icon(
                  onPressed: _loading ? null : _createItem,
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text('Item'),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search items…',
                isDense: true,
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: (v) => setState(() => _query = v),
            ),
          ),
          if (_units.isEmpty && !_loading)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.tertiaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.warning_amber_rounded),
                    const SizedBox(width: 10),
                    const Expanded(
                      child:
                          Text('Create a unit first — every item needs a unit.'),
                    ),
                    TextButton(onPressed: _createUnit, child: const Text('Create')),
                  ],
                ),
              ),
            ),
          if (!_loading)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Text(
                'Stock value: ₹${money(_totalValue)} · '
                '${_items.length} items',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
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
    if (_items.isEmpty) {
      return RefreshIndicator(
        onRefresh: _reload,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          children: const [
            Padding(
              padding: EdgeInsets.only(top: 120),
              child: EmptyState(
                  message: 'No items yet. Add units, then items.',
                  icon: Icons.inventory_2),
            ),
          ],
        ),
      );
    }
    final filtered = query.isEmpty
        ? _items
        : _items
              .where((item) =>
                  item.name.toLowerCase().contains(query) ||
                  (item.code?.toLowerCase().contains(query) ?? false) ||
                  (item.hsnSac?.toLowerCase().contains(query) ?? false))
              .toList();
    if (filtered.isEmpty) {
      return const EmptyState(message: 'No items match your search.');
    }
    return ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      itemCount: filtered.length,
      itemBuilder: (context, index) {
        final item = filtered[index];
        final stock = _stock[item.id];
        return Card(
          elevation: 0,
          margin: const EdgeInsets.only(bottom: 8),
          color: Theme.of(context).colorScheme.surfaceContainerLow,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: ListTile(
            dense: true,
            leading: CircleAvatar(
              radius: 18,
              backgroundColor: Theme.of(context).colorScheme.secondaryContainer,
              child: Icon(
                item.itemType == 'service'
                    ? Icons.handyman_outlined
                    : Icons.inventory_2_outlined,
                size: 18,
                color: Theme.of(context).colorScheme.onSecondaryContainer,
              ),
            ),
            title: Text(item.name,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w600)),
            subtitle: Text(
              [
                if (item.code != null) item.code!,
                if (item.hsnSac != null) 'HSN ${item.hsnSac}',
                item.unitName ?? '',
                '${_money0(item.gstRate)}%',
                item.categoryName ?? '',
              ].join(' · '),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '₹${money(stock?.value ?? 0)}',
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                Text(
                  '${qty(stock?.qty ?? 0)} ${item.unitName ?? ''}',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
              ],
            ),
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) =>
                    ItemDetailScreen(company: widget.company, item: item),
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _createUnit() async {
    final nameController = TextEditingController();
    String? uqc;
    final created = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('New unit'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                autofocus: true,
                decoration: const InputDecoration(
                  labelText: 'Unit name (e.g. Dozen)',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              InkWell(
                onTap: () async {
                  final picked = await pickOption(
                    context,
                    title: 'Unit code (UQC)',
                    options: unitCodes
                        .map((c) => PickerOption(id: c, label: c))
                        .toList(),
                    selectedId: uqc,
                  );
                  if (picked != null) setDialogState(() => uqc = picked);
                },
                child: InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'Unit code (optional)',
                    border: OutlineInputBorder(),
                  ),
                  child: Text(uqc ?? 'Select…'),
                ),
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
      await AppState.instance.api.createUnit(
        companyId: widget.company.id,
        name: nameController.text.trim(),
        uqc: uqc,
      );
      await _reload();
    } on BizKhataException catch (e) {
      _showError(e.message);
    }
  }

  Future<void> _createCategory() async {
    final nameController = TextEditingController();
    final created = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('New category'),
        content: TextField(
          controller: nameController,
          autofocus: true,
          decoration: const InputDecoration(
            labelText: 'Category name',
            border: OutlineInputBorder(),
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
      ),
    );
    if (created != true || nameController.text.trim().isEmpty) return;
    try {
      await AppState.instance.api.createCategory(
        companyId: widget.company.id,
        name: nameController.text.trim(),
      );
      await _reload();
    } on BizKhataException catch (e) {
      _showError(e.message);
    }
  }

  Future<void> _createItem() async {
    if (_units.isEmpty) {
      _showError('Create a unit first — every item needs a unit.');
      return;
    }
    final nameController = TextEditingController();
    final codeController = TextEditingController();
    final hsnController = TextEditingController();
    String? categoryId;
    String unitId = _units.first.id;
    double gstRate = 0;
    String itemType = 'goods';
    String valuation = 'weighted_average';
    var batchTracking = false;
    var expiryTracking = false;
    var sellable = true;
    var purchasable = true;

    final created = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) {
          final unitOptions = _units
              .map((u) => PickerOption(
                  id: u.id, label: '${u.name}${u.uqc == null ? '' : ' (${u.uqc})'}'))
              .toList();
          final categoryOptions = _categories
              .map((c) => PickerOption(id: c.id, label: c.name))
              .toList();
          return AlertDialog(
            title: const Text('New item'),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: nameController,
                    autofocus: true,
                    decoration: const InputDecoration(
                      labelText: 'Item name',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: codeController,
                    decoration: const InputDecoration(
                      labelText: 'Code (optional)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: hsnController,
                    decoration: const InputDecoration(
                      labelText: 'HSN/SAC (optional)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  InkWell(
                    onTap: () async {
                      final picked = await pickOption(
                        context,
                        title: 'GST rate',
                        options: gstRates
                            .map((r) => PickerOption(
                                id: r.toString(), label: '${_money0(r)}%'))
                            .toList(),
                        selectedId: gstRate.toString(),
                      );
                      if (picked != null) {
                        setDialogState(() => gstRate = double.parse(picked));
                      }
                    },
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        labelText: 'GST rate',
                        border: OutlineInputBorder(),
                      ),
                      child: Text('${_money0(gstRate)}%'),
                    ),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: itemType,
                    decoration: const InputDecoration(
                      labelText: 'Item type',
                      border: OutlineInputBorder(),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'goods', child: Text('Goods')),
                      DropdownMenuItem(
                          value: 'service', child: Text('Service')),
                    ],
                    onChanged: (v) =>
                        setDialogState(() => itemType = v ?? itemType),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: valuation,
                    decoration: const InputDecoration(
                      labelText: 'Valuation method',
                      border: OutlineInputBorder(),
                    ),
                    items: const [
                      DropdownMenuItem(
                          value: 'weighted_average',
                          child: Text('Weighted average')),
                      DropdownMenuItem(value: 'fifo', child: Text('FIFO')),
                    ],
                    onChanged: (v) =>
                        setDialogState(() => valuation = v ?? valuation),
                  ),
                  const SizedBox(height: 10),
                  InkWell(
                    onTap: () async {
                      final id = await pickOption(
                        context,
                        title: 'Unit',
                        options: unitOptions,
                        selectedId: unitId,
                      );
                      if (id != null) setDialogState(() => unitId = id);
                    },
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        labelText: 'Unit',
                        border: OutlineInputBorder(),
                      ),
                      child: Text(_units
                              .firstWhere((u) => u.id == unitId).name),
                    ),
                  ),
                  if (_categories.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    InkWell(
                      onTap: () async {
                        final id = await pickOption(
                          context,
                          title: 'Category',
                          options: categoryOptions,
                          selectedId: categoryId,
                        );
                        if (id != null) {
                          setDialogState(() => categoryId = id);
                        }
                      },
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          labelText: 'Category (optional)',
                          border: OutlineInputBorder(),
                        ),
                        child: Text(categoryId == null
                            ? 'Select…'
                            : _categories
                                .firstWhere((c) => c.id == categoryId)
                                .name),
                      ),
                    ),
                  ],
                  const SizedBox(height: 4),
                  for (final (value, label) in [
                    (batchTracking, 'Batch tracking'),
                    (expiryTracking, 'Expiry tracking'),
                    (sellable, 'Sellable'),
                    (purchasable, 'Purchasable'),
                  ])
                    CheckboxListTile(
                      value: value,
                      title: Text(label),
                      dense: true,
                      controlAffinity: ListTileControlAffinity.leading,
                      contentPadding: EdgeInsets.zero,
                      onChanged: (v) => setDialogState(() {
                        if (label == 'Batch tracking') {
                          batchTracking = v ?? false;
                        } else if (label == 'Expiry tracking') {
                          expiryTracking = v ?? false;
                        } else if (label == 'Sellable') {
                          sellable = v ?? true;
                        } else {
                          purchasable = v ?? true;
                        }
                      }),
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
    try {
      await AppState.instance.api.createItem(
        companyId: widget.company.id,
        categoryId: categoryId,
        unitId: unitId,
        name: nameController.text.trim(),
        code: codeController.text.trim(),
        hsnSac: hsnController.text.trim(),
        gstRate: gstRate,
        itemType: itemType,
        batchTracking: batchTracking,
        expiryTracking: expiryTracking,
        valuationMethod: valuation,
        isSellable: sellable,
        isPurchasable: purchasable,
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

  String _money0(double value) {
    if (value == value.roundToDouble()) return value.toStringAsFixed(0);
    return value.toStringAsFixed(2);
  }
}