import { useProvider } from "wagmi";
import { useContract } from "./useContract";
import { parseEther } from "@ethersproject/units";
import { useNetwork } from "./useNetwork";
import { formatBNToString } from "../utils";
import { MARKET_MAKER_ADDRESS } from "constants/addresses/marketMaker";
import MarketMakerABI from "../constants/abis/LSMRMarketMakerFactory.json";

export const useMarketMaker = () => {
  const provider = useProvider();
  const {
    chain: { id },
  } = useNetwork();
  const { caller, writer, loading } = useContract({
    addressOrName: MARKET_MAKER_ADDRESS[id],
    contractInterface: MarketMakerABI,
    signerOrProvider: provider,
  });

  const getCollateralToken = async () => {
    return await caller.collateralToken();
  };

  const conditionIds = async (index: number) => {
    return await caller.conditionIds(index);
  };

  const owner = async () => {
    return await caller.owner();
  };

  const funding = async () => {
    return caller.funding();
  };

  const stage = async () => {
    return caller.stage();
  };

  const close = async (from: string) => {
    return writer.close({ from });
  };

  const calcNetCost = async (outcomeTokenAmounts: number[]) => {
    return caller.calcNetCost(outcomeTokenAmounts);
  };

  const calcMarginalPrice = async (outcomeIndex: number) => {
    return caller.calcMarginalPrice(outcomeIndex);
  };

  const trade = async (
    tradeAmounts: number[],
    collateralLimit: number,
    from: string
  ) => {
    return writer.trade(tradeAmounts, collateralLimit, { from });
  };

  return {
    loading,
    getCollateralToken,
    conditionIds,
    owner,
    funding,
    stage,
    close,
    calcNetCost,
    calcMarginalPrice,
    trade,
  };
};
