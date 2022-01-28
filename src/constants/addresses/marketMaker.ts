import { buildAddresses } from "..";
import { ChainId } from "../chains";

export const MARKET_MAKER_ADDRESS = buildAddresses({
  [ChainId.Ropsten]: "0x45c74dc009948Fe875bb552D1011c3b0b42ea046",
});
