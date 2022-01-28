import * as React from "react";
import { useConnect, useAccount } from "wagmi";
// import { Button } from "components/Button";

import { useIsMounted } from "../hooks";
import { shortenAddress } from "utils/shortenAddress";
import { Typography, Button } from "@mui/material";

export const Connect = () => {
  const isMounted = useIsMounted();
  const [
    {
      data: { connector, connectors },
      error,
      loading,
    },
    connect,
  ] = useConnect();
  const metamask = connectors[0];
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  return (
    <div>
      <div>
        <Button
          disabled={isMounted && !metamask.ready}
          key={metamask.name}
          onClick={() =>
            accountData?.address ? disconnect() : connect(metamask)
          }
          variant="contained"
          style={{ width: 250 }}
        >
          {accountData?.address ? (
            <Typography fontSize="12px">
              {shortenAddress(accountData?.address, 5)}
            </Typography>
          ) : (
            <>
              <Typography fontSize="12px">Connect Wallet</Typography>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
