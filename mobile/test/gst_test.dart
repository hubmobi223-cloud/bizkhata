import 'package:flutter_test/flutter_test.dart';

import 'package:bizkhata_app/src/gst.dart';

void main() {
  group('round2', () {
    test('rounds to two decimals', () {
      expect(round2(1.004999), 1.0);
      expect(round2(1.005), 1.01);
      expect(round2(512.3456), 512.35);
    });

    test('handles integers', () {
      expect(round2(100), 100.0);
    });
  });

  group('taxableValue', () {
    test('qty * rate minus discount', () {
      expect(taxableValue(2, 100, 0), 200);
      expect(taxableValue(2, 100, 10), 190);
      expect(taxableValue(3, 1.25, 0), 3.75);
      expect(taxableValue(10, 0.33, 0.01), 3.29);
    });
  });

  group('splitTax', () {
    test('intra-state splits into CGST and SGST', () {
      final split = splitTax(1000, 18, true);
      expect(split.cgst, 90);
      expect(split.sgst, 90);
      expect(split.igst, 0);
    });

    test('halves split round-trips to full rate', () {
      for (final rate in [0.25, 3.0, 5.0, 12.0, 18.0, 28.0]) {
        final split = splitTax(7777.77, rate, true);
        expect(split.cgst + split.sgst, closeTo(round2(7777.77 * rate / 100), 0.01));
      }
    });

    test('inter-state goes to IGST only', () {
      final split = splitTax(1000, 18, false);
      expect(split.igst, 180);
      expect(split.cgst, 0);
      expect(split.sgst, 0);
    });

    test('returns zero when taxable or rate is zero', () {
      expect(splitTax(0, 18, true).total, 0);
      expect(splitTax(100, 0, true).total, 0);
    });
  });

  group('TaxSplit.total', () {
    test('sums components', () {
      const split = TaxSplit(cgst: 1.11, sgst: 2.22, igst: 3.33);
      expect(split.total, 6.66);
    });
  });
}