import { useProvider } from "wagmi";
import { useContract } from "./useContract";
import { parseEther } from "@ethersproject/units";
import { useNetwork } from "./useNetwork";
import { formatBNToString } from "../utils";
import { MARKET_MAKER_ADDRESS } from "constants/addresses/marketMaker";
import MarketMakerABI from "../constants/abis/LSMRMarketMakerFactory.json";
import { BigNumber } from "ethers";

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
    const data = await caller.collateralToken();
    return data;
  };

  const conditionIds = async (index: number) => {
    return caller.conditionIds(index);
  };

  const owner = async () => {
    return caller.owner();
  };

  const funding = async () => {
    return caller.funding();
  };

  const stage = async () => {
    return caller.stage();
  };

  const close = async (from: string) => {
    return writer.close({ from, gasLimit: 500000 });
  };

  const calcNetCost = async (outcomeTokenAmounts: BigNumber[]) => {
    return caller.calcNetCost(outcomeTokenAmounts);
  };

  const calcMarginalPrice = async (outcomeIndex: number) => {
    return caller.calcMarginalPrice(outcomeIndex);
  };

  const trade = async (
    tradeAmounts: BigNumber[],
    collateralLimit: number,
    from: string
  ) => {
    return writer.trade(tradeAmounts, collateralLimit, {
      from,
      gasLimit: 500000,
    });
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
