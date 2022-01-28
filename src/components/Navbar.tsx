import React from "react";
import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import { Connect } from "./Connect";

const Navbar = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py="10px"
      px="40px"
    >
      <img src="/icons/logo.png" alt="" height="55px" />
      <Box display="flex" alignItems="center">
        <Connect />
      </Box>
    </Box>
  );
};

export default Navbar;
