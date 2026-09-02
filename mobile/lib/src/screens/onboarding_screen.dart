import 'package:flutter/material.dart';

import '../labels.dart';
import '../services/api.dart';
import '../services/app_state.dart';
import '../widgets/pickers.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _name = TextEditingController();
  final _gstin = TextEditingController();
  String? _stateCode;
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _name.dispose();
    _gstin.dispose();
    super.dispose();
  }

  Future<void> _create() async {
    final name = _name.text.trim();
    if (name.isEmpty) {
      setState(() => _error = 'Company name is required');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await AppState.instance.api.createCompany(
        name: name,
        gstin: _gstin.text.trim(),
        stateCode: _stateCode,
      );
      await AppState.instance.loadCompanies();
      if (mounted) setState(() {});
    } on BizKhataException catch (e) {
      if (mounted) setState(() => _error = e.message);
    } catch (_) {
      if (mounted) setState(() => _error = 'Could not create company');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _pickState() async {
    final code = await pickOption(
      context,
      title: 'Company state',
      hint: 'Search state code…',
      options: stateCodes.map((c) => PickerOption(id: c, label: c)).toList(),
      selectedId: _stateCode,
    );
    if (code != null) setState(() => _stateCode = code);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Icon(Icons.business,
                      size: 48, color: theme.colorScheme.primary),
                  const SizedBox(height: 12),
                  Text(
                    'Create your company',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.headlineSmall
                        ?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'BizKhata seeds the chart of accounts, GST ledgers and the '
                    'current financial year automatically.',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodySmall
                        ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                  ),
                  const SizedBox(height: 24),
                  TextField(
                    controller: _name,
                    textCapitalization: TextCapitalization.words,
                    decoration: const InputDecoration(
                      labelText: 'Company name',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _gstin,
                    textCapitalization: TextCapitalization.characters,
                    decoration: const InputDecoration(
                      labelText: 'GSTIN (optional)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  FieldButton(
                    label: 'State code',
                    value: _stateCode,
                    placeholder: 'e.g. 27 for Maharashtra',
                    onTap: _pickState,
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.errorContainer,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        _error!,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onErrorContainer,
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 20),
                  FilledButton(
                    onPressed: _busy ? null : _create,
                    style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: _busy
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Create company'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}