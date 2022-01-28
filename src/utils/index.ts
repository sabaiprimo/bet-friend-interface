import { formatUnits, parseUnits } from "@ethersproject/units";

import { BigNumber } from "@ethersproject/bignumber";

export function formatBNToString(
  bn: BigNumber,
  nativePrecison: number,
  decimalPlaces?: number
): string {
  const fullPrecision = formatUnits(bn, nativePrecison);
  const decimalIdx = fullPrecision.indexOf(".");
  return decimalPlaces === undefined || decimalIdx === -1
    ? fullPrecision
    : fullPrecision.slice(
        0,
        decimalIdx + (decimalPlaces > 0 ? decimalPlaces + 1 : 0) // don't include decimal point if places = 0
      );
}

export function formatBNToShortString(
  bn: BigNumber,
  nativePrecision: number
): string {
  const bnStr = bn.toString();
  const numLen = bnStr.length - nativePrecision;
  if (numLen <= 0) {
    const roundNum = formatUnits(bn, nativePrecision);
    return `${roundNum.substr(0, 5)}`;
  }
  const div = Math.floor((numLen - 1) / 3);
  const mod = numLen % 3;
  const suffixes = ["", "k", "M", "B", "T"];

  return `${+bnStr.substr(0, mod || 3)}${suffixes[div]}`;
}
