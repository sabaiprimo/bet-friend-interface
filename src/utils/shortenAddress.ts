export const shortenAddress = (address: string, len = 4) => {
  return address ? `${address.slice(0, len)}...${address.slice(-len)}` : "";
};
