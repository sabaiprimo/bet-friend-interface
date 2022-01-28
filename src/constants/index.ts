import { ChainId } from "./chains";

export class Token {
  readonly addresses: { [chainId in any]: string };
  readonly decimals: number;
  readonly symbol: string;
  readonly name: string;
  readonly icon: string;

  constructor(
    addresses: { [chainId in any]: string },
    decimals: number,
    symbol: string,
    name: string,
    icon: string
  ) {
    this.addresses = addresses;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    this.icon = icon;
  }
}

export const buildAddresses = (
  addresses: Partial<Record<any, string>>
): Record<any, string> => {
  return Object.keys(ChainId).reduce((acc, id) => {
    const numId = Number(id) as ChainId;
    return { ...acc, [numId]: addresses?.[numId] || "" };
  }, {}) as Record<any, string>;
};
