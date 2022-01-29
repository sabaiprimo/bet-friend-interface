import { buildAddresses } from "..";
import { ChainId } from "../chains";

export const CONDITIONAL_TOKEN_ADDRESS = buildAddresses({
  [ChainId.Ropsten]: "0x5611e569E193b40d9A6c02207d87c022116A8216",
});
