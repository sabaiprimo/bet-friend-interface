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

  const balanceOf = async (account: string, positionId: number) => {
    return await caller.balanceOf(account, positionId);
  };

  const getOutcomeSlotCount = async (id: string) => {
    return await caller.getOutcomeSlotCount(id);
  };

  const getCollectionId = async (
    parentCollectionId: string,
    conditionId: string,
    indexSet: number[]
  ) => {
    return await caller.getCollectionId(
      parentCollectionId,
      conditionId,
      indexSet
    );
  };

  const payoutDenominator = async (conditionId: string) => {
    return await caller.payoutDenominator(conditionId);
  };

  const payoutNumerators = async (
    conditionId: string,
    outcomeIndex: number
  ) => {
    return await caller.payoutNumerators(conditionId, outcomeIndex);
  };

  const isApprovedForAll = async (
    account: string,
    lmsrMarketMakerAddress: string
  ) => {
    return await caller.isApprovedForAll(account, lmsrMarketMakerAddress);
  };

  const setApprovalForAll = async (
    lmsrMarketMakerAddress: string,
    approved: boolean,
    from: string
  ) => {
    return await writer.conditionalTokens.setApprovalForAll(
      lmsrMarketMakerAddress,
      approved,
      { from }
    );
  };

  const reportPayouts = async (
    questionId: string,
    payouts: number[],
    from: string
  ) => {
    return await writer.reportPayouts(questionId, payouts, { from });
  };

  const redeemPositions = async (
    collateralAddress: string,
    parentCollectionId: string,
    marketConditionId: string,
    indexSets: number[],
    from: string
  ) => {
    return await writer.conditionalTokens.redeemPositions(
      collateralAddress,
      parentCollectionId,
      marketConditionId,
      indexSets,
      { from }
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
