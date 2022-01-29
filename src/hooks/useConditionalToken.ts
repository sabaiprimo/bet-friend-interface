import { useProvider } from "wagmi";
import { useContract } from "./useContract";
import { parseEther } from "@ethersproject/units";
import { useNetwork } from "./useNetwork";
import { formatBNToString } from "../utils";
import { CONDITIONAL_TOKEN_ADDRESS } from "constants/addresses/conditionalToken";
import ConditionalTokenABI from "../constants/abis/ConditionalTokens.json";

export const useConditionalToken = () => {
  const provider = useProvider();
  const {
    chain: { id },
  } = useNetwork();
  const { caller, writer, loading } = useContract({
    addressOrName: CONDITIONAL_TOKEN_ADDRESS[id],
    contractInterface: ConditionalTokenABI,
    signerOrProvider: provider,
  });

  const balanceOf = async (account: string, positionId: string) => {
    console.log("account: ", account);
    console.log("positionId: ", positionId);
    try {
      const data = await caller.balanceOf(account, positionId);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getOutcomeSlotCount = async (id: string) => {
    return caller.getOutcomeSlotCount(id);
  };

  const getCollectionId = async (
    parentCollectionId: string,
    conditionId: string,
    indexSet: number[]
  ) => {
    return caller.getCollectionId(parentCollectionId, conditionId, indexSet);
  };

  const payoutDenominator = async (conditionId: string) => {
    return caller.payoutDenominator(conditionId);
  };

  const payoutNumerators = async (
    conditionId: string,
    outcomeIndex: number
  ) => {
    return caller.payoutNumerators(conditionId, outcomeIndex);
  };

  const isApprovedForAll = async (
    account: string,
    lmsrMarketMakerAddress: string
  ) => {
    return caller.isApprovedForAll(account, lmsrMarketMakerAddress);
  };

  const setApprovalForAll = async (
    lmsrMarketMakerAddress: string,
    approved: boolean,
    from: string
  ) => {
    return writer.setApprovalForAll(lmsrMarketMakerAddress, approved, {
      from,
      gasLimit: 500000,
    });
  };

  const reportPayouts = async (
    questionId: string,
    payouts: number[],
    from: string
  ) => {
    return writer.reportPayouts(questionId, payouts, {
      from,
      gasLimit: 500000,
    });
  };

  const redeemPositions = async (
    collateralAddress: string,
    parentCollectionId: string,
    marketConditionId: string,
    indexSets: number[],
    from: string
  ) => {
    return writer.conditionalTokens.redeemPositions(
      collateralAddress,
      parentCollectionId,
      marketConditionId,
      indexSets,
      { from, gasLimit: 500000 }
    );
  };

  return {
    loading,
    balanceOf,
    getCollectionId,
    getOutcomeSlotCount,
    payoutDenominator,
    payoutNumerators,
    isApprovedForAll,
    setApprovalForAll,
    reportPayouts,
    redeemPositions,
  };
};
