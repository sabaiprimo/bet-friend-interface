import React from "react";
import { Global, css } from "@emotion/react";

const styles = css`
  body {
    margin: 0;
    padding: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }
  *,
  *:before,
  *:after {
    -webkit-overflow-scrolling: touch;
  }
`;

export const GlobalStyle = () => <Global styles={styles} />;
