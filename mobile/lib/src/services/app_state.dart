import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../models.dart';
import 'api.dart';

class AppState extends ChangeNotifier {
  AppState._();

  static final AppState instance = AppState._();

  final BizApi api = BizApi(Supabase.instance.client);

  List<Company> companies = const [];
  Company? company;
  FinancialYear? fy;
  bool loadingCompanies = false;
  int revision = 0;

  void bump() {
    revision++;
    notifyListeners();
  }

  Future<void> loadCompanies() async {
    loadingCompanies = true;
    notifyListeners();
    try {
      companies = await api.companies();
      if (company == null && companies.isNotEmpty) {
        await selectCompany(companies.first, notify: false);
      } else if (company != null &&
          !companies.any((c) => c.id == company!.id)) {
        company = null;
        fy = null;
      }
      // ignore: avoid_catches_without_on_clauses
    } catch (_) {
      companies = const [];
    } finally {
      loadingCompanies = false;
      notifyListeners();
    }
  }

  Future<void> selectCompany(Company c, {bool notify = true}) async {
    company = c;
    fy = null;
    try {
      fy = await api.currentFy(c.id);
    } catch (_) {
      fy = null;
    }
    revision++;
    if (notify) notifyListeners();
  }

  Future<void> refreshFy() async {
    final c = company;
    if (c == null) return;
    fy = await api.currentFy(c.id);
    bump();
  }
}