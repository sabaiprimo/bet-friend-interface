import { useNetwork as useNetwork_ } from "wagmi";

export const useNetwork = () => {
  const [{ data: networkData }, switchNetwork] = useNetwork_();
  return {
    ...networkData,
    chain: {
      ...networkData.chain,
      id: networkData.chain?.id || 3,
    },
    switchNetwork,
  };
};
