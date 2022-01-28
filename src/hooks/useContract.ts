import { useEffect, useState } from "react";
import { Provider } from "@ethersproject/abstract-provider";
import { ContractInterface } from "@ethersproject/contracts";
import { Signer } from "ethers/lib/ethers";
import { useContract as useContract_, useProvider, useContext } from "wagmi";

type Config = {
  /** Contract address or ENS name */
  addressOrName: string;
  /** Contract interface or ABI */
  contractInterface: ContractInterface;
  /** Signer or provider to attach to contract */
  signerOrProvider?: Signer | Provider;
};

export const useContract = <Contract = any>(contractConfig: Config) => {
  const {
    state: { connector },
  } = useContext();

  const contract = useContract_<Contract>(contractConfig);
  const [writer, setWriter] = useState<Contract>(contract);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    load();
  }, [connector]);

  const load = async () => {
    setLoading(true);
    const contract_: any = contract;
    const signer = await connector?.getSigner();
    const contract__ = contract_.connect(signer);
    setWriter(contract__);
    setLoading(false);
  };

  return { caller: contract, writer: writer, loading } as const;
};
