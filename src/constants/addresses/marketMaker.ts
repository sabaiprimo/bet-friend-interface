import { buildAddresses } from "..";
import { ChainId } from "../chains";

export const MARKET_MAKER_ADDRESS = buildAddresses({
  [ChainId.Ropsten]: "0x6E6f31D4AAbF3497c0dEAA8ED0C4B09f57B14079",
});
