import { Chain, defaultChains, defaultL2Chains } from "wagmi";

export const Ropsten: Chain = {
  id: 3,
  name: "Ropsten",
  nativeCurrency: { name: "Ropsten Ether", symbol: "ropETH", decimals: 18 },
  rpcUrls: ["https://ropsten.infura.io/v3"],
  blockExplorers: [
    {
      name: "Etherscan",
      url: "https://ropsten.etherscan.io",
    },
  ],
  testnet: true,
};
export const chains: Chain[] = [Ropsten];

export enum ChainId {
  Ropsten = 3,
}
