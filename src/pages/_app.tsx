import * as React from "react";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { providers } from "ethers";
import { Connector, Provider } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { chains } from "../constants/chains";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "createEmotionCache";
import { StylesProvider } from "@mui/styles";
import { theme } from "theme";
import Head from "next/head";
import { GlobalStyle } from "GlobalStyle";

import Layout from "components/Layout";
// Set up connectors
type ConnectorsConfig = { chainId?: number };
const connectors = ({ chainId }: ConnectorsConfig) => {
  return [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {},
    }),
  ];
};

type ProviderConfig = { chainId?: number; connector?: Connector };

const provider = ({ chainId }: ProviderConfig) => {
  const network = chains.find((chain) => chain.id === chainId);
  let RPC = "";
  if (network) {
    RPC = network.rpcUrls[0] + "/" + process.env.NEXT_PUBLIC_INFURA_ID;
  } else {
    RPC = chains[0].rpcUrls[0] + "/" + process.env.NEXT_PUBLIC_INFURA_ID;
  }
  return providers.getDefaultProvider(RPC);
};
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Bet Friend</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <GlobalStyle />
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Provider autoConnect connectors={connectors} provider={provider}>
            <NextHead>
              <title>Bet Friend</title>
            </NextHead>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </ThemeProvider>
      </StylesProvider>
    </CacheProvider>
  );
};

export default App;
