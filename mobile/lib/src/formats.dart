import 'package:intl/intl.dart';

final NumberFormat _inr = NumberFormat('#,##,##0.00', 'en_IN');
final NumberFormat _inrWhole = NumberFormat('#,##,##0', 'en_IN');
final NumberFormat _inrQty = NumberFormat('#,##,##0.###', 'en_IN');
final DateFormat _date = DateFormat('dd MMM yyyy');

String money(num value) => _inr.format(value);

String moneyWhole(num value) => _inrWhole.format(value);

String qty(num value) => _inrQty.format(value);

String shortDate(DateTime date) => _date.format(date);

String todayIso() {
  final d = DateTime.now();
  final m = d.month.toString().padLeft(2, '0');
  final day = d.day.toString().padLeft(2, '0');
  return '${d.year}-$m-$day';
}

DateTime? parseIso(String? iso) {
  if (iso == null || iso.isEmpty) return null;
  return DateTime.tryParse(iso);
}

String signedMoney(num value) =>
    value >= 0 ? '₹${money(value)}' : '-₹${money(value.abs())}';