import * as React from "react";
import { useNetwork } from "wagmi";
import { Button } from "components/Button";

export const NetworkSwitcher = () => {
  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork();

  return (
    <div>
      <div>
        Connected to {networkData.chain?.name ?? networkData.chain?.id}{" "}
        {networkData.chain?.unsupported && "(unsupported)"}
      </div>

      {switchNetwork &&
        networkData.chains.map((x) =>
          x.id === networkData.chain?.id ? null : (
            <Button key={x.id} onClick={() => switchNetwork(x.id)}>
              Switch to {x.name}
            </Button>
          )
        )}

      {switchNetworkError && switchNetworkError?.message}
    </div>
  );
};
