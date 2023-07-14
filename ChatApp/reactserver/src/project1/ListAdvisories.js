import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  CardContent,
  TextField,
  Autocomplete,
  Typography,
} from "@mui/material";
import theme from "../theme";
import "../App.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
const ListAdvisories = (props) => {
  const initialState = {
    advisories: [],
    names: [],
    regions: [],
    subregions: [],
    alerts: [],
    autoCompleteControl: false,
    radioGroupValue: "",
    options: [],
    tableData: [],
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    fetchData();
  }, []);

  const sendParentSomeData = (msg) => {
    props.dataFromChild(msg);
  };

  const fetchData = async () => {
    // const GRAPHURL = "http://localhost:5000/graphql";
    const GRAPHURL = "/graphql";
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: "query{alerts{country,name,text,date,region,subregion}}",
        }),
      });
      let response1 = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: "query{advisories{name, country, text, date}}",
        }),
      });
      let response2 = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: "query{regions}",
        }),
      });
      let response3 = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: "query{subregions}",
        }),
      });
      let json = await response.json();
      let json1 = await response1.json();
      let json2 = await response2.json();
      let json3 = await response3.json();
      setState({
        alerts: json.data.alerts,
        advisories: json1.data.advisories,
        names: Array.from(
          new Set(json1.data.advisories.map((item) => item.name))
        ),
        regions: json2.data.regions.filter((item) => item !== ""),
        subregions: json3.data.subregions.filter((item) => item !== ""),
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  const onChange = (e, selectedOption) => {
    let selected = null;
    if (state.radioGroupValue === "Traveler") {
      selected = state.advisories.filter(
        (item) => item.name === selectedOption
      );
      if (selected.length !== 0) {
        const data = selected.map((item) => {
          return { country: item.country, text: item.text, date: item.date };
        });
        setState({ tableData: data });
        sendParentSomeData(
          `Found ${data.length} alert(s) for ${selectedOption} `
        );
      }
    } else if (state.radioGroupValue === "Region") {
      selected = state.regions.find((item) => item === selectedOption);
      if (selected !== undefined) {
        let countries = state.alerts.filter((item) => item.region === selected);
        const data = countries.map((item) => {
          return { country: item.name, text: item.text, date: item.date };
        });
        setState({ tableData: data });
        sendParentSomeData(
          `Found ${data.length} alerts for ${selectedOption} `
        );
      }
    } else if (state.radioGroupValue === "Sub-Region") {
      selected = state.subregions.find((item) => item === selectedOption);
      if (selected !== undefined) {
        let countries = state.alerts.filter(
          (item) => item.subregion === selected
        );
        const data = countries.map((item) => {
          return { country: item.name, text: item.text, date: item.date };
        });
        setState({ tableData: data });
        sendParentSomeData(
          `Found ${data.length} alerts for ${selectedOption} `
        );
      }
    }
  };

  const radioChange = (e, value) => {
    switch (value) {
      case "Traveler":
        setState({
          options: state.names,
          radioGroupValue: value,
          autoCompleteControl: !state.autoCompleteControl,
          tableData: [],
        });
        sendParentSomeData(`Found ${state.names.length} travelers `);
        break;
      case "Region":
        setState({
          options: state.regions,
          radioGroupValue: value,
          autoCompleteControl: !state.autoCompleteControl,
          tableData: [],
        });
        sendParentSomeData(`Found ${state.regions.length} regions `);
        break;
      case "Sub-Region":
        setState({
          options: state.subregions,
          radioGroupValue: value,
          autoCompleteControl: !state.autoCompleteControl,
          tableData: [],
        });
        sendParentSomeData(`Found ${state.subregions.length} subregions `);
        break;
      default:
        setState({ radioGroupValue: value });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="primary" style={{ fontSize: "20px" }}>
          List Advisories By:
        </Typography>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={radioChange}
          >
            <FormControlLabel
              value="Traveler"
              control={<Radio />}
              label="Traveler"
              sx={{
                ".MuiFormControlLabel-label": {
                  fontSize: "14px",
                },
              }}
            />
            <FormControlLabel
              value="Region"
              control={<Radio />}
              label="Region"
              sx={{
                ".MuiFormControlLabel-label": {
                  fontSize: "14px",
                },
              }}
            />
            <FormControlLabel
              value="Sub-Region"
              control={<Radio />}
              label="Sub-Region"
              sx={{
                ".MuiFormControlLabel-label": {
                  fontSize: "14px",
                },
              }}
            />
          </RadioGroup>
        </FormControl>
        <p></p>
        <Autocomplete
          key={state.autoCompleteControl}
          data-testid="autocomplete"
          options={state.options}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          onChange={onChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={state.radioGroupValue}
              variant="outlined"
              fullWidth
            />
          )}
        />
        <p></p>
        {state.tableData.length !== 0 ? (
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography color="primary" style={{ fontWeight: "bold" }}>
                      Country
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="primary" style={{ fontWeight: "bold" }}>
                      Alert Information
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.tableData.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.country}</TableCell>
                      <TableCell>
                        {item.text} {item.date}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </CardContent>
    </ThemeProvider>
  );
};
export default ListAdvisories;
