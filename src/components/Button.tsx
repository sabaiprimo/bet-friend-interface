import styled from "@emotion/styled";
import { Button as MuiButton } from "@mui/material";

export const Button = styled(MuiButton)`
  color: ${({ theme }) => theme.palette.text.primary};
  background: linear-gradient(360deg, #c2e04c 0%, #c2e04c 174%);
  border-radius: 32px;
  text-transform: initial;
`;

// F9F8F6
// C2E04C
// 3714D2
