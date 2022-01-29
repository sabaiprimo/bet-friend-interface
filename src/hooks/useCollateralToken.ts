import { useProvider } from "wagmi";
import { useContract } from "./useContract";
import { parseEther } from "@ethersproject/units";
import { useNetwork } from "./useNetwork";
import { formatBNToString } from "../utils";
// import { CONDITIONAL_TOKEN_ADDRESS } from "constants/addresses/conditionalToken";
import CollateralTokenABI from "../constants/abis/WETH9.json";
import { BigNumber } from "ethers";

export const useCollateralToken = (erc20Address: string) => {
  const provider = useProvider();
  const {
    chain: { id },
  } = useNetwork();
  const { caller, writer, loading } = useContract({
    addressOrName: erc20Address,
    contractInterface: CollateralTokenABI,
    signerOrProvider: provider,
  });

  const balanceOf = async (account: string) => {
    console.log("account: ", account);

    try {
      const data = await caller.balanceOf(account);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deposit = async (addr: string, amount: BigNumber) => {
    return writer.deposit({
      value: amount,
      from: addr,
      gasLimit: 500000,
    });
  };

  const approve = async (addr: string, amount: BigNumber) => {
    return writer.approve(addr, amount, { gasLimit: 500000 });
  };

  return {
    loading,
    balanceOf,
    deposit,
    approve,
  };
};
