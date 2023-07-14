import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { CardContent, Typography } from "@mui/material";
import "../App.css";
const HomePage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CardContent>
        <br />
        <Typography
          color="primary"
          style={{ float: "right", paddingRight: "1vh", fontSize: "smaller" }}
        >
          &copy;Info3139 - 2022
        </Typography>
      </CardContent>
    </ThemeProvider>
  );
};
export default HomePage;
