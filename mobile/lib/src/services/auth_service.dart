import 'package:supabase_flutter/supabase_flutter.dart';

import 'api.dart';

class AuthService {
  Future<String> get currentUserId async {
    final session = Supabase.instance.client.auth.currentSession;
    return session?.user.id ?? '';
  }

  Future<void> signIn({required String email, required String password}) async {
    try {
      await Supabase.instance.client.auth
          .signInWithPassword(email: email, password: password);
    } catch (e) {
      throw BizKhataException('Invalid email or password');
    }
  }

  Future<void> signUp({required String email, required String password}) async {
    try {
      final res = await Supabase.instance.client.auth
          .signUp(email: email, password: password);
      if (res.session == null) {
        await Supabase.instance.client.auth
            .signInWithPassword(email: email, password: password);
      }
    } catch (e) {
      if (e is AuthException && e.message.contains('already registered')) {
        throw const BizKhataException(
            'An account with this email already exists. Please sign in.');
      }
      throw const BizKhataException('Could not create account');
    }
  }

  Future<void> signOut() async {
    await Supabase.instance.client.auth.signOut();
  }
}