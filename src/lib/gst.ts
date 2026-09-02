export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function taxableValue(qty: number, rate: number, discount: number): number {
  return round2(qty * rate - discount);
}

export interface TaxSplit {
  cgst: number;
  sgst: number;
  igst: number;
}

export function splitTax(taxable: number, gstRate: number, intra: boolean): TaxSplit {
  if (taxable <= 0 || gstRate <= 0) return { cgst: 0, sgst: 0, igst: 0 };
  if (intra) {
    const half = round2((taxable * gstRate) / 200);
    return { cgst: half, sgst: round2(taxable * gstRate / 100 - half), igst: 0 };
  }
  return { cgst: 0, sgst: 0, igst: round2((taxable * gstRate) / 100) };
}

export function taxTotal(split: TaxSplit): number {
  return round2(split.cgst + split.sgst + split.igst);
}