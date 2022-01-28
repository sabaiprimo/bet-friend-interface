import { buildAddresses } from "..";
import { ChainId } from "../chains";

export const TOKEN_SYMBOL = buildAddresses({
  [ChainId.Ropsten]: "ETH",
});
