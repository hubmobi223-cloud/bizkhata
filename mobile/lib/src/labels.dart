const Map<String, String> voucherTypeLabels = {
  'receipt': 'Receipt',
  'payment': 'Payment',
  'journal': 'Journal',
  'contra': 'Contra',
  'sales': 'Sales',
  'purchase': 'Purchase',
  'credit_note': 'Credit Note',
  'debit_note': 'Debit Note',
  'opening_balance': 'Opening Balance',
};

const Map<String, String> groupTypeLabels = {
  'assets': 'Assets',
  'liabilities': 'Liabilities',
  'income': 'Income',
  'expense': 'Expenses',
};

const Map<String, String> itemTypeLabels = {
  'goods': 'Goods',
  'service': 'Service',
};

const List<double> gstRates = [0, 0.25, 3, 5, 12, 18, 28];

const List<String> unitCodes = [
  'BAG', 'BAL', 'BKT', 'BOX', 'BTL', 'CAN', 'CTN', 'DOZ', 'DRM', 'GMS',
  'KG', 'KGS', 'LTR', 'MTR', 'NOS', 'PAC', 'PKT', 'QTL', 'QTY', 'ROL',
  'SET', 'SQF', 'SQM', 'TON', 'TBS',
];

const List<String> stateCodes = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '16', '17', '18', '19', '20', '21',
  '22', '23', '24', '25', '26', '27', '28', '29', '30', '31',
  '32', '33', '34', '35', '36', '37', '38',
];