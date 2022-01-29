import Web3 from "web3";

export const getConditionId = (
  oracleAddress: string,
  questionId: string,
  outcomeSlotCount: number
) => {
  return Web3.utils.soliditySha3(
    { t: "address", v: oracleAddress },
    { t: "bytes32", v: questionId },
    { t: "uint", v: outcomeSlotCount }
  );
};

export const getPositionId = (
  collateralToken: string,
  collectionId: string
) => {
  console.log("collateralTOken: ", collateralToken);
  console.log("collectionId: ", collectionId);
  return Web3.utils.soliditySha3(
    { t: "address", v: collateralToken },
    { t: "bytes32", v: collectionId }
  );
};
