double _n(Map<String, dynamic> m, String k) =>
    (m[k] as num?)?.toDouble() ?? 0;

bool _b(Map<String, dynamic> m, String k) => m[k] as bool? ?? false;

String? _sn(Map<String, dynamic> m, String k) => m[k] as String?;

String _s(Map<String, dynamic> m, String k) => m[k] as String? ?? '';

class Company {
  final String id;
  final String name;
  final String? gstin;
  final String? stateCode;
  final String role;

  const Company({
    required this.id,
    required this.name,
    this.gstin,
    this.stateCode,
    this.role = 'accountant',
  });

  factory Company.fromJson(Map<String, dynamic> m) => Company(
        id: _s(m, 'id'),
        name: _s(m, 'name'),
        gstin: _sn(m, 'gstin'),
        stateCode: _sn(m, 'state_code'),
        role: _s(m, 'role'),
      );
}

class FinancialYear {
  final String id;
  final String companyId;
  final String name;
  final String startDate;
  final String endDate;
  final bool isActive;
  final bool isLocked;

  const FinancialYear({
    required this.id,
    required this.companyId,
    required this.name,
    required this.startDate,
    required this.endDate,
    this.isActive = true,
    this.isLocked = false,
  });

  factory FinancialYear.fromJson(Map<String, dynamic> m) => FinancialYear(
        id: _s(m, 'id'),
        companyId: _s(m, 'company_id'),
        name: _s(m, 'name'),
        startDate: _s(m, 'start_date'),
        endDate: _s(m, 'end_date'),
        isActive: _b(m, 'is_active'),
        isLocked: _b(m, 'is_locked'),
      );
}

class AccountGroup {
  final String id;
  final String name;
  final String groupType;
  final String? parentId;
  final bool isSummary;

  const AccountGroup({
    required this.id,
    required this.name,
    required this.groupType,
    this.parentId,
    this.isSummary = false,
  });

  factory AccountGroup.fromJson(Map<String, dynamic> m) => AccountGroup(
        id: _s(m, 'id'),
        name: _s(m, 'name'),
        groupType: _s(m, 'group_type'),
        parentId: _sn(m, 'parent_id'),
        isSummary: _b(m, 'is_summary'),
      );
}

class Ledger {
  final String id;
  final String accountGroupId;
  final String name;
  final String? code;
  final double openingDebit;
  final double openingCredit;
  final bool isParty;
  final bool isCashBank;
  final bool isTaxLedger;
  final double taxRate;
  final String? gstin;
  final String? stateCode;

  const Ledger({
    required this.id,
    required this.accountGroupId,
    required this.name,
    this.code,
    this.openingDebit = 0,
    this.openingCredit = 0,
    this.isParty = false,
    this.isCashBank = false,
    this.isTaxLedger = false,
    this.taxRate = 0,
    this.gstin,
    this.stateCode,
  });

  factory Ledger.fromJson(Map<String, dynamic> m) => Ledger(
        id: _s(m, 'id'),
        accountGroupId: _s(m, 'account_group_id'),
        name: _s(m, 'name'),
        code: _sn(m, 'code'),
        openingDebit: _n(m, 'opening_debit'),
        openingCredit: _n(m, 'opening_credit'),
        isParty: _b(m, 'is_party'),
        isCashBank: _b(m, 'is_cash_bank'),
        isTaxLedger: _b(m, 'is_tax_ledger'),
        taxRate: _n(m, 'tax_rate'),
        gstin: _sn(m, 'gstin'),
        stateCode: _sn(m, 'state_code'),
      );
}

class TrialBalanceRow {
  final String ledgerId;
  final String ledgerName;
  final String groupName;
  final String groupType;
  final double netBalance;

  const TrialBalanceRow({
    required this.ledgerId,
    required this.ledgerName,
    required this.groupName,
    required this.groupType,
    required this.netBalance,
  });

  factory TrialBalanceRow.fromJson(Map<String, dynamic> m) => TrialBalanceRow(
        ledgerId: _s(m, 'ledger_id'),
        ledgerName: _s(m, 'ledger_name'),
        groupName: _s(m, 'group_name'),
        groupType: _s(m, 'group_type'),
        netBalance: _n(m, 'net_balance'),
      );
}

class DayBookRow {
  final String id;
  final String companyId;
  final String fyId;
  final String voucherType;
  final String voucherNumber;
  final String voucherDate;
  final String? narration;
  final String? partyName;
  final double debit;
  final double credit;
  final String status;

  const DayBookRow({
    required this.id,
    required this.companyId,
    required this.fyId,
    required this.voucherType,
    required this.voucherNumber,
    required this.voucherDate,
    this.narration,
    this.partyName,
    this.debit = 0,
    this.credit = 0,
    required this.status,
  });

  factory DayBookRow.fromJson(Map<String, dynamic> m) => DayBookRow(
        id: _s(m, 'id'),
        companyId: _s(m, 'company_id'),
        fyId: _s(m, 'fy_id'),
        voucherType: _s(m, 'voucher_type'),
        voucherNumber: _s(m, 'voucher_number'),
        voucherDate: _s(m, 'voucher_date'),
        narration: _sn(m, 'narration'),
        partyName: _sn(m, 'party_name'),
        debit: _n(m, 'debit'),
        credit: _n(m, 'credit'),
        status: _s(m, 'status'),
      );
}

class LedgerPosting {
  final String entryId;
  final String voucherId;
  final String ledgerId;
  final int entryNo;
  final double debit;
  final double credit;
  final String ledgerName;
  final String groupName;
  final String voucherDate;
  final String voucherNumber;
  final String voucherType;

  const LedgerPosting({
    required this.entryId,
    required this.voucherId,
    required this.ledgerId,
    required this.entryNo,
    required this.debit,
    required this.credit,
    required this.ledgerName,
    required this.groupName,
    required this.voucherDate,
    required this.voucherNumber,
    required this.voucherType,
  });

  factory LedgerPosting.fromJson(Map<String, dynamic> m) => LedgerPosting(
        entryId: _s(m, 'entry_id'),
        voucherId: _s(m, 'voucher_id'),
        ledgerId: _s(m, 'ledger_id'),
        entryNo: (m['entry_no'] as num?)?.toInt() ?? 0,
        debit: _n(m, 'debit'),
        credit: _n(m, 'credit'),
        ledgerName: _s(m, 'ledger_name'),
        groupName: _s(m, 'group_name'),
        voucherDate: _s(m, 'voucher_date'),
        voucherNumber: _s(m, 'voucher_number'),
        voucherType: _s(m, 'voucher_type'),
      );
}

class VoucherItem {
  final String id;
  final String itemId;
  final String? description;
  final double qty;
  final double rate;
  final double discount;
  final double taxableValue;
  final double gstRate;
  final double cgst;
  final double sgst;
  final double igst;
  final double cess;
  final String? itemName;
  final String? hsnSac;

  const VoucherItem({
    required this.id,
    required this.itemId,
    this.description,
    this.qty = 0,
    this.rate = 0,
    this.discount = 0,
    this.taxableValue = 0,
    this.gstRate = 0,
    this.cgst = 0,
    this.sgst = 0,
    this.igst = 0,
    this.cess = 0,
    this.itemName,
    this.hsnSac,
  });

  factory VoucherItem.fromJson(Map<String, dynamic> m) {
    final itemRaw = m['item'];
    Map<String, dynamic>? item;
    if (itemRaw is Map<String, dynamic>) {
      item = itemRaw;
    } else if (itemRaw is List && itemRaw.isNotEmpty) {
      item = itemRaw.first as Map<String, dynamic>?;
    }
    return VoucherItem(
      id: _s(m, 'id'),
      itemId: _s(m, 'item_id'),
      description: _sn(m, 'description'),
      qty: _n(m, 'qty'),
      rate: _n(m, 'rate'),
      discount: _n(m, 'discount'),
      taxableValue: _n(m, 'taxable_value'),
      gstRate: _n(m, 'gst_rate'),
      cgst: _n(m, 'cgst'),
      sgst: _n(m, 'sgst'),
      igst: _n(m, 'igst'),
      cess: _n(m, 'cess'),
      itemName: item?['name'] as String?,
      hsnSac: item?['hsn_sac'] as String?,
    );
  }
}

class Unit {
  final String id;
  final String name;
  final String? uqc;

  const Unit({required this.id, required this.name, this.uqc});

  factory Unit.fromJson(Map<String, dynamic> m) =>
      Unit(id: _s(m, 'id'), name: _s(m, 'name'), uqc: _sn(m, 'uqc'));
}

class ItemCategory {
  final String id;
  final String name;

  const ItemCategory({required this.id, required this.name});

  factory ItemCategory.fromJson(Map<String, dynamic> m) =>
      ItemCategory(id: _s(m, 'id'), name: _s(m, 'name'));
}

class Item {
  final String id;
  final String? categoryId;
  final String unitId;
  final String name;
  final String? code;
  final String? hsnSac;
  final double gstRate;
  final String itemType;
  final bool batchTracking;
  final bool expiryTracking;
  final String valuationMethod;
  final bool isSellable;
  final bool isPurchasable;
  final String? categoryName;
  final String? unitName;
  final String? unitUqc;

  const Item({
    required this.id,
    this.categoryId,
    required this.unitId,
    required this.name,
    this.code,
    this.hsnSac,
    this.gstRate = 0,
    this.itemType = 'goods',
    this.batchTracking = false,
    this.expiryTracking = false,
    this.valuationMethod = 'weighted_average',
    this.isSellable = true,
    this.isPurchasable = true,
    this.categoryName,
    this.unitName,
    this.unitUqc,
  });

  factory Item.fromJson(Map<String, dynamic> m) {
    Map<String, dynamic>? embedded(Map<String, dynamic> map, String key) {
      final raw = map[key];
      if (raw is Map<String, dynamic>) return raw;
      if (raw is List && raw.isNotEmpty) return raw.first as Map<String, dynamic>;
      return null;
    }

    final category = embedded(m, 'category');
    final unit = embedded(m, 'unit');
    return Item(
      id: _s(m, 'id'),
      categoryId: _sn(m, 'category_id'),
      unitId: _s(m, 'unit_id'),
      name: _s(m, 'name'),
      code: _sn(m, 'code'),
      hsnSac: _sn(m, 'hsn_sac'),
      gstRate: _n(m, 'gst_rate'),
      itemType: _s(m, 'item_type'),
      batchTracking: _b(m, 'batch_tracking'),
      expiryTracking: _b(m, 'expiry_tracking'),
      valuationMethod: _s(m, 'valuation_method'),
      isSellable: _b(m, 'is_sellable'),
      isPurchasable: _b(m, 'is_purchasable'),
      categoryName: category?['name'] as String?,
      unitName: unit?['name'] as String?,
      unitUqc: unit?['uqc'] as String?,
    );
  }
}

class Batch {
  final String id;
  final String itemId;
  final String batchNo;
  final String? mfgDate;
  final String? expiryDate;
  final String status;

  const Batch({
    required this.id,
    required this.itemId,
    required this.batchNo,
    this.mfgDate,
    this.expiryDate,
    this.status = 'open',
  });

  factory Batch.fromJson(Map<String, dynamic> m) => Batch(
        id: _s(m, 'id'),
        itemId: _s(m, 'item_id'),
        batchNo: _s(m, 'batch_no'),
        mfgDate: _sn(m, 'mfg_date'),
        expiryDate: _sn(m, 'expiry_date'),
        status: _s(m, 'status'),
      );
}

class StockBalance {
  final String id;
  final String itemId;
  final String? batchId;
  final double qty;
  final double value;
  final String? batchNo;
  final String? itemName;

  const StockBalance({
    required this.id,
    required this.itemId,
    this.batchId,
    this.qty = 0,
    this.value = 0,
    this.batchNo,
    this.itemName,
  });

  factory StockBalance.fromJson(Map<String, dynamic> m) {
    final batchRaw = m['batch'];
    String? batchNo;
    if (batchRaw is Map<String, dynamic>) {
      batchNo = batchRaw['batch_no'] as String?;
    }
    final itemRaw = m['item'];
    String? itemName;
    if (itemRaw is Map<String, dynamic>) {
      itemName = itemRaw['name'] as String?;
    }
    return StockBalance(
      id: _s(m, 'id'),
      itemId: _s(m, 'item_id'),
      batchId: _sn(m, 'batch_id'),
      qty: _n(m, 'qty'),
      value: _n(m, 'value'),
      batchNo: batchNo,
      itemName: itemName,
    );
  }
}

class StockBookRow {
  final String id;
  final String itemId;
  final String batchNo;
  final String stockDate;
  final String? voucherId;
  final String? voucherType;
  final String movement;
  final double inwardQty;
  final double outwardQty;
  final double rate;
  final double value;
  final double balanceQty;
  final double balanceValue;

  const StockBookRow({
    required this.id,
    required this.itemId,
    required this.batchNo,
    required this.stockDate,
    this.voucherId,
    this.voucherType,
    required this.movement,
    this.inwardQty = 0,
    this.outwardQty = 0,
    this.rate = 0,
    this.value = 0,
    this.balanceQty = 0,
    this.balanceValue = 0,
  });

  factory StockBookRow.fromJson(Map<String, dynamic> m) => StockBookRow(
        id: _s(m, 'id'),
        itemId: _s(m, 'item_id'),
        batchNo: _sn(m, 'batch_no') ?? '',
        stockDate: _s(m, 'stock_date'),
        voucherId: _sn(m, 'voucher_id'),
        voucherType: _sn(m, 'voucher_type'),
        movement: _s(m, 'movement'),
        inwardQty: _n(m, 'inward_qty'),
        outwardQty: _n(m, 'outward_qty'),
        rate: _n(m, 'rate'),
        value: _n(m, 'value'),
        balanceQty: _n(m, 'balance_qty'),
        balanceValue: _n(m, 'balance_value'),
      );
}