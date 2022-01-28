import React from "react";
import Navbar from "./Navbar";
import styled from "@emotion/styled";

const Background = styled.div`
  background: linear-gradient(0deg, #d9afd9, #97d9e1);

  /* background-attachment: fixed; */
  background-size: contain;
  min-height: 100vh;
`;

type Props = {
  children: React.ReactNode;
};
const Layout = (props: Props) => {
  const { children } = props;
  return (
    <Background>
      <Navbar />
      {children}
    </Background>
  );
};

export default Layout;
