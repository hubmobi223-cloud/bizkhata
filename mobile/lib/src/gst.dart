double round2(double value) =>
    ((value + 2.220446049250313e-16) * 100).round() / 100;

double taxableValue(double qty, double rate, double discount) =>
    round2(qty * rate - discount);

class TaxSplit {
  final double cgst;
  final double sgst;
  final double igst;

  const TaxSplit({this.cgst = 0, this.sgst = 0, this.igst = 0});

  double get total => round2(cgst + sgst + igst);
}

TaxSplit splitTax(double taxable, double gstRate, bool intra) {
  if (taxable <= 0 || gstRate <= 0) return const TaxSplit();
  if (intra) {
    final half = round2((taxable * gstRate) / 200);
    return TaxSplit(
      cgst: half,
      sgst: round2(taxable * gstRate / 100 - half),
    );
  }
  return TaxSplit(igst: round2((taxable * gstRate) / 100));
}