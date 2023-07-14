import React, { useReducer, useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CardContent, Typography } from "@mui/material";
import theme from "../theme";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
const ResetAlerts = ({ dataFromChild }) => {
  const initialState = {
    msg: "",
    contactServer: false,
    aresults: [],
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dataFromChild("running setup...");
        // const GRAPHURL = "http://localhost:5000/graphql";
        const GRAPHURL = "/graphql";
        let response = await fetch(GRAPHURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({ query: "query { setupalerts{results} }" }),
        });

        let json = await response.json();
        setState({
          aresults: json.data.setupalerts.results
            .replace(/([.])\s*(?=[A-Z])/g, "$1|")
            .split("|"),
        });
        dataFromChild("Results Loaded");
      } catch (error) {
        console.log(error);
        setState({
          msg: `Problem loading server data - ${error.message}`,
        });
      }
    };
    if (!hasFetchedData.current) {
      fetchData();
      hasFetchedData.current = true;
    }
  }, [dataFromChild]);

  return (
    <ThemeProvider theme={theme}>
      <CardContent>
        <Typography
          color="primary"
          style={{ fontSize: "20px", textAlign: "center" }}
        >
          Alert Setup - Details
        </Typography>
        <p></p>
        <div>
          <Typography color="error">{state.msg}</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" width="100%">
              <TableBody>
                {state.aresults.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography color="error" style={{ fontWeight: "bold" }}>
                        {item}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </CardContent>
    </ThemeProvider>
  );
};
export default ResetAlerts;
