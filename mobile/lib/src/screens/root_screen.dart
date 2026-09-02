import 'dart:async';

import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../config.dart';
import '../services/app_state.dart';
import 'auth_screen.dart';
import 'main_shell.dart';
import 'onboarding_screen.dart';

class RootScreen extends StatefulWidget {
  const RootScreen({super.key});

  @override
  State<RootScreen> createState() => _RootScreenState();
}

class _RootScreenState extends State<RootScreen> {
  StreamSubscription<AuthState>? _sub;

  @override
  void initState() {
    super.initState();
    _sub = Supabase.instance.client.auth.onAuthStateChange.listen((state) {
      _sync();
    });
    _sync();
  }

  void _sync() {
    final user = Supabase.instance.client.auth.currentUser;
    if (user != null) {
      AppState.instance.loadCompanies();
    }
    setState(() {});
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!AppConfig.isConfigured) {
      return const SetupRequiredScreen();
    }
    final user = Supabase.instance.client.auth.currentUser;
    if (user == null) {
      return const AuthScreen();
    }
    return ListenableBuilder(
      listenable: AppState.instance,
      builder: (context, child) {
        final state = AppState.instance;
        if (state.companies.isEmpty) {
          if (state.loadingCompanies) {
            return const _Splash();
          }
          return const OnboardingScreen();
        }
        return const MainShell();
      },
    );
  }
}

class _Splash extends StatelessWidget {
  const _Splash();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}

class SetupRequiredScreen extends StatelessWidget {
  const SetupRequiredScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.account_balance,
                    size: 56, color: theme.colorScheme.primary),
                const SizedBox(height: 16),
                Text('BizKhata',
                    style: theme.textTheme.headlineMedium
                        ?.copyWith(fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Text(
                  'Supabase is not configured for this build.\n\n'
                  'Run the app with your project URL and anon key:\n\n'
                  'flutter run --dart-define=SUPABASE_URL=… '
                  '--dart-define=SUPABASE_ANON_KEY=…\n\n'
                  'Use the same keys as the web app .env.local.',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}