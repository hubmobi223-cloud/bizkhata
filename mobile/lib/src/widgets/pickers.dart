import 'package:flutter/material.dart';

class PickerOption {
  final String id;
  final String label;
  final String? code;

  const PickerOption({required this.id, required this.label, this.code});
}

Future<String?> pickOption(
  BuildContext context, {
  required String title,
  required List<PickerOption> options,
  String? selectedId,
  String hint = 'Search…',
}) {
  return showModalBottomSheet<String>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (context) => _PickerSheet(
      title: title,
      options: options,
      selectedId: selectedId,
      hint: hint,
    ),
  );
}

class _PickerSheet extends StatefulWidget {
  final String title;
  final List<PickerOption> options;
  final String? selectedId;
  final String hint;

  const _PickerSheet({
    required this.title,
    required this.options,
    required this.selectedId,
    required this.hint,
  });

  @override
  State<_PickerSheet> createState() => _PickerSheetState();
}

class _PickerSheetState extends State<_PickerSheet> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final query = _query.trim().toLowerCase();
    final filtered = query.isEmpty
        ? widget.options
        : widget.options
              .where((o) =>
                  o.label.toLowerCase().contains(query) ||
                  (o.code?.toLowerCase().contains(query) ?? false))
              .toList();

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.75,
        minChildSize: 0.4,
        maxChildSize: 0.95,
        builder: (context, scrollController) {
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 4, 20, 8),
                child: TextField(
                  autofocus: true,
                  decoration: InputDecoration(
                    hintText: widget.hint,
                    prefixIcon: const Icon(Icons.search),
                    isDense: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onChanged: (v) => setState(() => _query = v),
                ),
              ),
              Expanded(
                child: filtered.isEmpty
                    ? const Center(child: Text('No options found'))
                    : ListView.builder(
                        controller: scrollController,
                        itemCount: filtered.length,
                        itemBuilder: (context, index) {
                          final option = filtered[index];
                          final selected = option.id == widget.selectedId;
                          return ListTile(
                            title: Text(option.label),
                            subtitle: option.code != null && option.code!.isNotEmpty
                                ? Text(option.code!)
                                : null,
                            trailing: selected
                                ? const Icon(Icons.check_circle)
                                : null,
                            onTap: () => Navigator.of(context)
                                .pop(option.id),
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class FieldButton extends StatelessWidget {
  final String label;
  final String? value;
  final String? placeholder;
  final VoidCallback onTap;
  final bool error;

  const FieldButton({
    super.key,
    required this.label,
    required this.value,
    required this.onTap,
    this.placeholder = 'Select…',
    this.error = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final text = (value == null || value!.isEmpty) ? placeholder : value;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: scheme.onSurfaceVariant)),
        const SizedBox(height: 6),
        InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: onTap,
          child: InputDecorator(
            decoration: InputDecoration(
              isDense: true,
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: error ? scheme.error : scheme.outlineVariant,
                ),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    text!,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: (value == null || value!.isEmpty)
                              ? scheme.onSurfaceVariant
                              : scheme.onSurface,
                        ),
                  ),
                ),
                Icon(Icons.expand_more, size: 18, color: scheme.outline),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

Future<String?> pickItem<T>(
  BuildContext context, {
  required String title,
  required List<T> items,
  required String Function(T) idOf,
  required String Function(T) labelOf,
  String Function(T)? codeOf,
  String? selectedId,
}) {
  return pickOption(
    context,
    title: title,
    selectedId: selectedId,
    options: items
        .map((item) => PickerOption(
              id: idOf(item),
              label: labelOf(item),
              code: codeOf?.call(item),
            ))
        .toList(),
  );
}