import {
  Box,
  Container,
  Paper,
  MenuItem,
  Select,
  RadioGroup,
  Radio,
  Button,
  Grid,
} from "@mui/material";
import { useMarketMaker } from "hooks/useMarketMaker";
import markets from "conf/config.local.json";
import React, { useState, useEffect, useCallback } from "react";
import { getConditionId, getPositionId } from "utils/market";
import { useConditionalToken } from "hooks/useConditionalToken";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { ZERO_ADDRESS } from "constants/misc";
import { TextField } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { formatBNToString } from "utils";
import { useCollateralToken } from "hooks/useCollateralToken";
import { parseEther } from "ethers/lib/utils";
import styled from "@emotion/styled";

type TradingFormProps = {
  isMarketClosed: boolean;
  marketInfo: any;
  setSelectedAmount: any;
  setSelectedOutcomeToken: any;
  selectedOutcomeToken: number;
};

type TraderActionsProps = {
  marketInfo: any;
  isMarketClosed: boolean;
  selectedAmount: string;
  redeem: any;
  buy: any;
  sell: any;
};

type OperatorActionsProps = {
  isMarketClosed: boolean;
  close: any;
};

type OracleActionsProps = {
  isMarketClosed: boolean;
  marketInfo: any;
  resolve: any;
};

const TradingForm: React.FC<TradingFormProps> = ({
  isMarketClosed,
  marketInfo,
  setSelectedAmount,
  setSelectedOutcomeToken,
  selectedOutcomeToken,
}) => (
  <>
    <Box>
      <TextField
        variant="filled"
        label="Collateral value"
        type="number"
        onChange={(e) => setSelectedAmount(e.target.value)}
        disabled={isMarketClosed}
      />
    </Box>
    <RadioGroup
      style={{ marginTop: "30px" }}
      defaultValue={0}
      onChange={(e) => setSelectedOutcomeToken(parseInt(e.target.value))}
      value={selectedOutcomeToken}
    >
      {marketInfo.outcomes.map((outcome: any, index: number) => (
        <Box key={outcome.title}>
          <Grid container>
            <Grid item xs={6}>
              <FormControlLabel
                value={!isMarketClosed ? outcome.index : "disabled"}
                control={<Radio color="primary" />}
                label={outcome.title}
              />
            </Grid>

            <Grid item xs={6}>
              <Box>Probability: {outcome.probability.toString()}%</Box>

              <Box>My balance: {outcome.balance.toFixed(5).toString()}</Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </RadioGroup>
  </>
);

const TraderActions: React.FC<TraderActionsProps> = ({
  marketInfo,
  isMarketClosed,
  selectedAmount,
  redeem,
  buy,
  sell,
}) => (
  <Box>
    <h3>Trader actions:</h3>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Button
          variant="contained"
          style={{ width: "100%" }}
          onClick={redeem}
          disabled={!isMarketClosed || !marketInfo.payoutDenominator}
        >
          Redeem
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="contained"
          style={{ width: "100%" }}
          onClick={buy}
          disabled={isMarketClosed || !selectedAmount}
        >
          Buy
        </Button>
      </Grid>

      <Grid item xs={4}>
        <Button
          style={{ width: "100%" }}
          variant="contained"
          onClick={sell}
          disabled={isMarketClosed || !selectedAmount}
        >
          Sell
        </Button>
      </Grid>
    </Grid>
  </Box>
);

const OperatorActions: React.FC<OperatorActionsProps> = ({
  isMarketClosed,
  close,
}) => (
  <>
    <h3>Operator actions:</h3>
    <Button variant="contained" onClick={close} disabled={isMarketClosed}>
      Close
    </Button>
  </>
);

const OracleActions: React.FC<OracleActionsProps> = ({
  isMarketClosed,
  marketInfo,
  resolve,
}) => (
  <>
    <h3>Oracle actions:</h3>
    <div>
      {marketInfo.outcomes.map((outcome: any, index: number) => (
        <Button
          key={outcome.short}
          variant="contained"
          onClick={() => resolve(index)}
          disabled={!isMarketClosed}
        >
          Resolve {outcome.title}
        </Button>
      ))}
    </div>
  </>
);

enum MarketStage {
  Running = 0,
  Paused = 1,
  Closed = 2,
}
const Market = () => {
  const [isConditionLoaded, setIsConditionLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [selectedOutcomeToken, setSelectedOutcomeToken] = useState<number>(0);
  const [marketInfo, setMarketInfo] = useState<any>(undefined);
  const [collateralAddr, setCollateralAddr] = useState<string>(ZERO_ADDRESS);
  const marketMaker = useMarketMaker();
  const conditionalToken = useConditionalToken();
  const collateral = useCollateralToken(collateralAddr);

  const [{ data: account, error, loading }, disconnect] = useAccount();

  useEffect(() => {
    const init = async () => {
      try {
        if (!isLoading) {
          setIsLoading(true);
          await getMarketInfo();
          setIsLoading(false);
          setIsConditionLoaded(true);
        }
      } catch (err) {
        setIsConditionLoaded(false);
        console.error(err);
      }
    };
    if (account?.address) {
      console.log("account: ", account);
      init();
    }
  }, [account?.address]);

  const buy = async () => {
    console.log("--------------------------buy---------------------");
    const formatedAmount = parseEther(selectedAmount);
    // new BigNumber(selectedAmount).multipliedBy(
    //   new BigNumber(Math.pow(10, collateral.decimals)),
    // )

    const outcomeTokenAmounts = Array.from(
      { length: marketInfo.outcomes.length },
      (value: any, index: number) =>
        index === selectedOutcomeToken ? formatedAmount : BigNumber.from(0)
    );

    const cost = await marketMaker.calcNetCost(outcomeTokenAmounts);
    if (collateralAddr != ZERO_ADDRESS) {
      const collateralBalance = await collateral.balanceOf(account?.address!);
      console.log(collateral);
      console.log(collateralAddr);
      if (cost.gt(collateralBalance)) {
        await collateral.deposit(account?.address!, formatedAmount);
        await collateral.approve(
          "0x6E6f31D4AAbF3497c0dEAA8ED0C4B09f57B14079",
          formatedAmount
        );
      }

      const tx = await marketMaker.trade(outcomeTokenAmounts, cost);
      console.log({ tx });
    }

    await getMarketInfo();
  };

  const sell = async () => {
    const formatedAmount = parseEther(selectedAmount);

    const isApproved = await conditionalToken.isApprovedForAll(
      account?.address ?? ZERO_ADDRESS,
      marketInfo.lmsrAddress
    );
    if (!isApproved) {
      await conditionalToken.setApprovalForAll(
        marketInfo.lmsrAddress,
        true,
        account?.address ?? ZERO_ADDRESS
      );
    }

    const outcomeTokenAmounts = Array.from(
      { length: marketInfo.outcomes.length },
      (v, i) =>
        i === selectedOutcomeToken ? formatedAmount.mul(-1) : BigNumber.from(0)
    );
    if (collateralAddr != ZERO_ADDRESS) {
      const profit = (await marketMaker.calcNetCost(outcomeTokenAmounts)).mul(
        -1
      );

      const tx = await marketMaker.trade(outcomeTokenAmounts, profit);
      console.log({ tx });
    }

    await getMarketInfo();
  };

  const redeem = async () => {
    const indexSets = Array.from(
      { length: marketInfo.outcomes.length },
      (v, i) => (i === 0 ? 1 : parseInt(Math.pow(10, i).toString(), 2))
    );

    const tx = await conditionalToken.redeemPositions(
      collateralAddr,
      `0x${"0".repeat(64)}`,
      marketInfo.conditionId,
      indexSets,
      account?.address ?? ZERO_ADDRESS
    );
    console.log({ tx });

    await getMarketInfo();
  };

  const close = async () => {
    const tx = await marketMaker.close(account?.address ?? ZERO_ADDRESS);
    console.log({ tx });

    await getMarketInfo();
  };

  const resolve = async (resolutionOutcomeIndex: number) => {
    const payouts = Array.from(
      { length: marketInfo.outcomes.length },
      (value: any, index: number) => (index === resolutionOutcomeIndex ? 1 : 0)
    );

    const tx = await conditionalToken.reportPayouts(
      marketInfo.questionId,
      payouts,
      account?.address ?? ZERO_ADDRESS
    );
    console.log({ tx });

    await getMarketInfo();
  };

  const getMarketInfo = async () => {
    if (!process.env.NEXT_PUBLIC_ORACLE_ADDRESS) return false;

    const collateral = await marketMaker.getCollateralToken();
    setCollateralAddr(collateral);
    const conditionId = getConditionId(
      process.env.NEXT_PUBLIC_ORACLE_ADDRESS,
      markets.markets[0].questionId,
      markets.markets[0].outcomes.length
    );

    const payoutDenominator = await conditionalToken.payoutDenominator(
      conditionId!
    );

    const outcomes = [];
    for (
      let outcomeIndex = 0;
      outcomeIndex < markets.markets[0].outcomes.length;
      outcomeIndex++
    ) {
      const indexSet = [
        outcomeIndex === 0
          ? 1
          : parseInt(Math.pow(10, outcomeIndex).toString(), 2),
      ];
      const collectionId = await conditionalToken.getCollectionId(
        `0x${"0".repeat(64)}`,
        conditionId!,
        indexSet
      );

      const positionId = await getPositionId(collateral, collectionId);

      const probability = await marketMaker.calcMarginalPrice(outcomeIndex);

      const balance = await conditionalToken.balanceOf(
        account?.address ?? ZERO_ADDRESS,
        positionId!
      );

      const payoutNumerator = await conditionalToken.payoutNumerators(
        conditionId!,
        outcomeIndex
      );

      const outcome = {
        index: outcomeIndex,
        title: markets.markets[0].outcomes[outcomeIndex].title,
        probability: probability
          .div(BigNumber.from(2).pow(64))
          .mul(100)
          .toString(),
        balance: +formatBNToString(balance, 18),
        payoutNumerator: payoutNumerator,
      };
      outcomes.push(outcome);
    }

    const marketData = {
      lmsrAddress: "0x6E6f31D4AAbF3497c0dEAA8ED0C4B09f57B14079",
      title: markets.markets[0].title,
      outcomes,
      stage: MarketStage[await marketMaker.stage()],
      questionId: markets.markets[0].questionId,
      conditionId: conditionId,
      payoutDenominator: payoutDenominator,
    };

    setMarketInfo(marketData);
    return true;
  };

  const isMarketClosed =
    isConditionLoaded &&
    marketInfo &&
    MarketStage[marketInfo?.stage].toString() === MarketStage.Closed.toString();

  return (
    <>
      {isConditionLoaded ? (
        <>
          <h2>{marketInfo.title}</h2>
          <p>State: {marketInfo.stage}</p>
          <TradingForm
            isMarketClosed={isMarketClosed}
            marketInfo={marketInfo}
            setSelectedAmount={setSelectedAmount}
            setSelectedOutcomeToken={setSelectedOutcomeToken}
            selectedOutcomeToken={selectedOutcomeToken}
          />
          <TraderActions
            marketInfo={marketInfo}
            isMarketClosed={isMarketClosed}
            selectedAmount={selectedAmount}
            redeem={redeem}
            buy={buy}
            sell={sell}
          />
          {account?.address === process.env.NEXT_PUBLIC_ORACLE_ADDRESS && (
            <OperatorActions isMarketClosed={isMarketClosed} close={close} />
          )}
          {account?.address === process.env.NEXT_PUBLIC_ORACLE_ADDRESS && (
            <OracleActions
              isMarketClosed={isMarketClosed}
              marketInfo={marketInfo}
              resolve={resolve}
            />
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

const GlassPaper = styled(Paper)`
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(3.5px);
  -webkit-backdrop-filter: blur(3.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;
export const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <GlassPaper elevation={3}>
        <Box style={{ padding: "40px 30px" }}>
          <Market />
        </Box>
      </GlassPaper>
    </Container>
  );
};
