// @ts-ignore
import { AbstractConnector } from "@web3-react/abstract-connector";

import INJECTED_ICON_URL from "../assets/images/arrow-right.svg";
import METAMASK_ICON_URL from "../assets/images/metamask-fox.svg";
import WALLETCONNECT_ICON_URL from "../assets/images/walletConnectIcon.svg";

interface WalletInfo {
  name: string;
  iconURL: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  MetaMask: {
    name: "MetaMask",
    iconURL: METAMASK_ICON_URL,
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
  WalletConnect: {
    name: "WalletConnect",
    iconURL: WALLETCONNECT_ICON_URL,
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    href: null,
    color: "#4196FC",
    mobile: true,
  },
};
