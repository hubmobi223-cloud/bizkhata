import 'package:supabase_flutter/supabase_flutter.dart';

import '../models.dart';

class BizKhataException implements Exception {
  final String message;
  const BizKhataException(this.message);

  @override
  String toString() => message;
}

Future<T> _guard<T>(Future<T> Function() run) async {
  try {
    return await run();
  } on BizKhataException {
    rethrow;
  } on PostgrestException catch (e) {
    throw BizKhataException(e.message);
  } on AuthException catch (e) {
    throw BizKhataException(e.message);
  } catch (e) {
    throw BizKhataException(e.toString());
  }
}

String labelKey(String value) => value.trim().toLowerCase();

class BizApi {
  BizApi(this._db);

  final SupabaseClient _db;

  Future<List<Company>> companies() async {
    return _guard(() async {
      final user = _db.auth.currentUser;
      if (user == null) return const <Company>[];
      final rows = await _db
          .from('company_members')
          .select('role, company:companies(*)')
          .eq('user_id', user.id)
          .order('company(created_at)');
      return rows
          .map((row) => Company.fromJson({
                ...row['company'] as Map<String, dynamic>,
                'role': row['role'],
              }))
          .toList();
    });
  }

  Future<String> createCompany({
    required String name,
    String? gstin,
    String? stateCode,
  }) async {
    return _guard(() async {
      final id = await _db.rpc<dynamic>('sp_create_company', params: {
        'p_name': name,
        'p_gstin':
            (gstin == null || gstin.trim().isEmpty) ? null : gstin.trim(),
        'p_state_code':
            (stateCode == null || stateCode.isEmpty) ? null : stateCode,
      });
      return (id as String?) ?? '';
    });
  }

  Future<FinancialYear?> currentFy(String companyId) async {
    return _guard(() async {
      final data = await _db.rpc<dynamic>('fn_current_fy', params: {
        'p_company': companyId,
      });
      if (data == null) return null;
      if (data is List) {
        if (data.isEmpty) return null;
        return FinancialYear.fromJson(data.first as Map<String, dynamic>);
      }
      return FinancialYear.fromJson(data as Map<String, dynamic>);
    });
  }

  Future<List<AccountGroup>> accountGroups(String companyId) async {
    return _guard(() async {
      final rows = await _db
          .from('account_groups')
          .select()
          .eq('company_id', companyId)
          .order('sort_order')
          .order('name');
      return rows.map(AccountGroup.fromJson).toList();
    });
  }

  Future<AccountGroup> createGroup({
    required String companyId,
    required String name,
    required String groupType,
  }) async {
    return _guard(() async {
      final row = await _db
          .from('account_groups')
          .insert({
            'company_id': companyId,
            'name': name,
            'group_type': groupType,
            'parent_id': null,
            'is_summary': false,
          })
          .select()
          .single();
      return AccountGroup.fromJson(row);
    });
  }

  Future<List<Ledger>> ledgers(String companyId) async {
    return _guard(() async {
      final rows = await _db
          .from('ledgers')
          .select()
          .eq('company_id', companyId)
          .eq('is_active', true)
          .order('name');
      return rows.map(Ledger.fromJson).toList();
    });
  }

  Future<Ledger> createLedger({
    required String companyId,
    required String accountGroupId,
    required String name,
    String? code,
    double openingDebit = 0,
    double openingCredit = 0,
    bool isParty = false,
    bool isCashBank = false,
    bool isTaxLedger = false,
    double taxRate = 0,
    String? gstin,
    String? stateCode,
  }) async {
    return _guard(() async {
      final row = await _db
          .from('ledgers')
          .insert({
            'company_id': companyId,
            'account_group_id': accountGroupId,
            'name': name,
            'code': (code == null || code.trim().isEmpty) ? null : code.trim(),
            'opening_debit': openingDebit,
            'opening_credit': openingCredit,
            'is_party': isParty,
            'is_cash_bank': isCashBank,
            'is_tax_ledger': isTaxLedger,
            'tax_rate': taxRate,
            'gstin': (isParty && gstin != null && gstin.trim().isNotEmpty)
                ? gstin.trim()
                : null,
            'state_code': (isParty && stateCode != null && stateCode.isNotEmpty)
                ? stateCode
                : null,
          })
          .select()
          .single();
      return Ledger.fromJson(row);
    });
  }

  Future<List<TrialBalanceRow>> trialBalance(String companyId) async {
    return _guard(() async {
      final rows = await _db
          .from('v_trial_balance')
          .select()
          .eq('company_id', companyId);
      return rows.map(TrialBalanceRow.fromJson).toList();
    });
  }

  Future<List<DayBookRow>> dayBook({
    required String companyId,
    String? fyId,
    String? type,
    int limit = 50,
  }) async {
    return _guard(() async {
      var query = _db
          .from('v_day_book')
          .select()
          .eq('company_id', companyId);
      if (fyId != null && fyId.isNotEmpty) query = query.eq('fy_id', fyId);
      if (type != null && type.isNotEmpty) {
        query = query.eq('voucher_type', type);
      }
      final rows = await query
          .order('voucher_date', ascending: false)
          .order('voucher_number', ascending: false)
          .limit(limit);
      return rows.map(DayBookRow.fromJson).toList();
    });
  }

  Future<List<LedgerPosting>> ledgerPostings(
    String companyId,
    String ledgerId,
  ) async {
    return _guard(() async {
      final rows = await _db
          .from('v_ledger_postings')
          .select()
          .eq('company_id', companyId)
          .eq('ledger_id', ledgerId)
          .eq('status', 'posted')
          .order('voucher_date');
      return rows.map(LedgerPosting.fromJson).toList();
    });
  }

  Future<
    ({
      DayBookRow voucher,
      List<LedgerPosting> entries,
      List<VoucherItem> items,
    })
  >
  voucherDetail({
    required String companyId,
    required String voucherId,
  }) async {
    return _guard(() async {
      final voucherRow = await _db
          .from('v_day_book')
          .select()
          .eq('company_id', companyId)
          .eq('id', voucherId)
          .single();

      final entriesRows = await _db
          .from('v_ledger_postings')
          .select()
          .eq('company_id', companyId)
          .eq('voucher_id', voucherId)
          .order('entry_no');

      final itemsRows = await _db
          .from('voucher_items')
          .select(
            'id, description, qty, rate, discount, taxable_value, gst_rate, cgst, sgst, igst, cess, item:items(id, name, hsn_sac)',
          )
          .eq('company_id', companyId)
          .eq('voucher_id', voucherId)
          .order('sort_order');

      return (
        voucher: DayBookRow.fromJson(voucherRow),
        entries: entriesRows.map(LedgerPosting.fromJson).toList(),
        items: itemsRows.map(VoucherItem.fromJson).toList(),
      );
    });
  }

  Future<String> postVoucher({
    required String companyId,
    required String fyId,
    required String type,
    required String date,
    String? narration,
    required List<Map<String, dynamic>> entries,
  }) async {
    return _guard(() async {
      final id = await _db.rpc<dynamic>('sp_post_voucher', params: {
        'p_company': companyId,
        'p_fy': fyId,
        'p_type': type,
        'p_date': date,
        'p_narration': (narration == null || narration.trim().isEmpty)
            ? null
            : narration.trim(),
        'p_entries': entries,
        'p_party_ledger': null,
      });
      return (id as String?) ?? '';
    });
  }

  Future<void> cancelVoucher(String voucherId) async {
    return _guard(() async {
      await _db.rpc<dynamic>('sp_cancel_voucher', params: {
        'p_voucher_id': voucherId,
      });
    });
  }

  Future<List<Unit>> units(String companyId) async {
    return _guard(() async {
      final rows = await _db
          .from('units')
          .select()
          .eq('company_id', companyId)
          .order('name');
      return rows.map(Unit.fromJson).toList();
    });
  }

  Future<Unit> createUnit({
    required String companyId,
    required String name,
    String? uqc,
  }) async {
    return _guard(() async {
      final row = await _db
          .from('units')
          .insert({
            'company_id': companyId,
            'name': name,
            'uqc': (uqc == null || uqc.trim().isEmpty) ? null : uqc.trim(),
          })
          .select()
          .single();
      return Unit.fromJson(row);
    });
  }

  Future<List<ItemCategory>> categories(String companyId) async {
    return _guard(() async {
      final rows = await _db
          .from('item_categories')
          .select()
          .eq('company_id', companyId)
          .order('name');
      return rows.map(ItemCategory.fromJson).toList();
    });
  }

  Future<ItemCategory> createCategory({
    required String companyId,
    required String name,
  }) async {
    return _guard(() async {
      final row = await _db
          .from('item_categories')
          .insert({'company_id': companyId, 'name': name})
          .select()
          .single();
      return ItemCategory.fromJson(row);
    });
  }

  Future<List<Item>> items(String companyId) async {
    return _guard(() async {
      final rows = await _db
          .from('items')
          .select(
            'id, company_id, category_id, unit_id, name, code, hsn_sac, gst_rate, item_type, batch_tracking, expiry_tracking, valuation_method, is_sellable, is_purchasable, is_active, category:item_categories(id, name), unit:units(id, name, uqc)',
          )
          .eq('company_id', companyId)
          .order('name');
      return rows.map(Item.fromJson).toList();
    });
  }

  Future<Item> createItem({
    required String companyId,
    String? categoryId,
    required String unitId,
    required String name,
    String? code,
    String? hsnSac,
    double gstRate = 0,
    String itemType = 'goods',
    bool batchTracking = false,
    bool expiryTracking = false,
    String valuationMethod = 'weighted_average',
    bool isSellable = true,
    bool isPurchasable = true,
  }) async {
    return _guard(() async {
      final row = await _db
          .from('items')
          .insert({
            'company_id': companyId,
            'category_id': (categoryId == null || categoryId.isEmpty)
                ? null
                : categoryId,
            'unit_id': unitId,
            'name': name,
            'code': (code == null || code.trim().isEmpty) ? null : code.trim(),
            'hsn_sac': (hsnSac == null || hsnSac.trim().isEmpty)
                ? null
                : hsnSac.trim(),
            'gst_rate': gstRate,
            'item_type': itemType,
            'batch_tracking': batchTracking,
            'expiry_tracking': expiryTracking,
            'valuation_method': valuationMethod,
            'is_sellable': isSellable,
            'is_purchasable': isPurchasable,
          })
          .select()
          .single();
      return Item.fromJson(row);
    });
  }

  Future<List<StockBalance>> stockBalance({
    required String companyId,
    required String itemId,
  }) async {
    return _guard(() async {
      final rows = await _db
          .from('stock_balances')
          .select(
            'id, company_id, item_id, batch_id, qty, value, item:items(id, name, gst_rate, hsn_sac), batch:batches(id, batch_no)',
          )
          .eq('company_id', companyId)
          .eq('item_id', itemId)
          .order('value', ascending: false);
      return rows.map(StockBalance.fromJson).toList();
    });
  }

  Future<List<StockBookRow>> stockBook({
    required String companyId,
    required String itemId,
  }) async {
    return _guard(() async {
      final rows = await _db
          .from('v_stock_book')
          .select()
          .eq('company_id', companyId)
          .eq('item_id', itemId)
          .order('stock_date', ascending: false);
      return rows.map(StockBookRow.fromJson).toList();
    });
  }

  Future<List<Batch>> batches({
    required String companyId,
    required String itemId,
  }) async {
    return _guard(() async {
      final rows = await _db
          .from('batches')
          .select()
          .eq('company_id', companyId)
          .eq('item_id', itemId)
          .order('batch_no');
      return rows.map(Batch.fromJson).toList();
    });
  }

  Future<Map<String, ({double qty, double value})>> allStock(
    String companyId,
  ) async {
    return _guard(() async {
      final rows = await _db
          .from('stock_balances')
          .select('item_id, qty, value')
          .eq('company_id', companyId);
      final map = <String, ({double qty, double value})>{};
      for (final row in rows) {
        final itemId = row['item_id'] as String?;
        if (itemId == null) continue;
        final current = map[itemId] ?? (qty: 0.0, value: 0.0);
        map[itemId] = (
          qty: current.qty + ((row['qty'] as num?)?.toDouble() ?? 0),
          value: current.value + ((row['value'] as num?)?.toDouble() ?? 0),
        );
      }
      return map;
    });
  }

  Future<
    ({
      List<Ledger> parties,
      List<Ledger> cashBanks,
      Ledger? sales,
      Ledger? purchase,
      Ledger? cgstOut,
      Ledger? sgstOut,
      Ledger? igstOut,
      Ledger? cgstIn,
      Ledger? sgstIn,
      Ledger? igstIn,
    })
  >
  billingLedgers(String companyId) async {
    final all = await ledgers(companyId);
    Ledger? byName(String name) {
      final key = labelKey(name);
      for (final l in all) {
        if (labelKey(l.name) == key) return l;
      }
      return null;
    }

    return (
      parties: all
          .where(
            (l) =>
                l.isParty ||
                labelKey(l.name).contains('sundry debtor') ||
                labelKey(l.name).contains('sundry creditor'),
          )
          .toList(),
      cashBanks: all.where((l) => l.isCashBank).toList(),
      sales: byName('Sales A/c'),
      purchase: byName('Purchase A/c'),
      cgstOut: byName('CGST Output A/c'),
      sgstOut: byName('SGST Output A/c'),
      igstOut: byName('IGST Output A/c'),
      cgstIn: byName('CGST Input A/c'),
      sgstIn: byName('SGST Input A/c'),
      igstIn: byName('IGST Input A/c'),
    );
  }

  Future<String> postBill({
    required String companyId,
    required String fyId,
    required String type,
    required String date,
    String? invoiceNo,
    String? invoiceDate,
    String? placeOfSupply,
    String? narration,
    required String partyLedgerId,
    required List<Map<String, dynamic>> entries,
    required List<Map<String, dynamic>> items,
  }) async {
    return _guard(() async {
      final id = await _db.rpc<dynamic>('sp_post_voucher', params: {
        'p_company': companyId,
        'p_fy': fyId,
        'p_type': type,
        'p_date': date,
        'p_entries': entries,
        'p_party_ledger': partyLedgerId,
        'p_invoice_no': (invoiceNo == null || invoiceNo.trim().isEmpty)
            ? null
            : invoiceNo.trim(),
        'p_invoice_date': invoiceDate,
        'p_place_of_supply': (placeOfSupply == null || placeOfSupply.isEmpty)
            ? null
            : placeOfSupply,
        'p_narration': (narration == null || narration.trim().isEmpty)
            ? null
            : narration.trim(),
        'p_items': items,
      });
      return (id as String?) ?? '';
    });
  }

  Future<int> countActiveLedgers(String companyId) async {
    return _guard(() async {
      final res = await _db
          .from('ledgers')
          .select('id')
          .eq('company_id', companyId)
          .eq('is_active', true)
          .count(CountOption.exact);
      return res.count;
    });
  }

  Future<int> countActiveItems(String companyId) async {
    return _guard(() async {
      final res = await _db
          .from('items')
          .select('id')
          .eq('company_id', companyId)
          .eq('is_active', true)
          .count(CountOption.exact);
      return res.count;
    });
  }

  Future<int> countPostedVouchers(String companyId, String fyId) async {
    return _guard(() async {
      final res = await _db
          .from('vouchers')
          .select('id')
          .eq('company_id', companyId)
          .eq('status', 'posted')
          .eq('fy_id', fyId)
          .count(CountOption.exact);
      return res.count;
    });
  }

  Future<double> stockValue(String companyId) async {
    return _guard(() async {
      final rows = await _db
          .from('stock_balances')
          .select('value')
          .eq('company_id', companyId);
      double total = 0;
      for (final row in rows) {
        total += (row['value'] as num?)?.toDouble() ?? 0;
      }
      return total;
    });
  }
}