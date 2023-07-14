import React, { useReducer, useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  CardContent,
  TextField,
  Autocomplete,
  Button,
  Typography,
} from "@mui/material";
import theme from "../theme";
import "../App.css";
const AddAdvisory = ({ dataFromChild }) => {
  const initialState = {
    name: "",
    country: "",
    text: "",
    date: "",
    alerts: [],
    countries: [],
    autoCompleteControl: false,
    inputValue: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const GRAPHURL = "http://localhost:5000/graphql";
        const GRAPHURL = "/graphql";

        let response = await fetch(GRAPHURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            query: "query{alerts{country,name,text,date,region,subregion}}",
          }),
        });
        let json = await response.json();
        setState({
          countries: json.data.alerts.map((item) => item.name),
          alerts: json.data.alerts,
        });
        dataFromChild("Found 249 countries");
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

  const onAddClicked = async () => {
    let advisory = {
      name: state.name,
      country: state.country,
      text: state.text,
      date: state.date,
    };
    // const GRAPHURL = "http://localhost:5000/graphql";
    const GRAPHURL = "/graphql";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{ addAdvisory(name: "${advisory.name}", country: "${advisory.country}", text: "${advisory.text}", date: "${advisory.date}") {name, country, text, date}}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();
      setState({
        name: "",
        country: "",
        text: "",
        date: "",
        autoCompleteControl: !state.autoCompleteControl,
      });
      dataFromChild(`added advisory on ${json.data.addAdvisory.date}`);
    } catch (error) {
      dataFromChild(`${error.message} - Advisory not added`);
    }
  };

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };
  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.countries.find((item) => item === state.inputValue) === undefined;

  const onChange = (e, selectedOption) => {
    let alert = state.alerts.find((item) => item.name === selectedOption);
    if (alert !== null && alert !== undefined)
      setState({ country: alert.name, text: alert.text, date: alert.date });
  };

  const inputValueChange = (e, value, reason) => {
    setState({ inputValue: value });
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
          Add Advisory
        </Typography>
        <p></p>
        <TextField
          onChange={handleNameInput}
          placeholder="Enter user's name here"
          value={state.name}
        />
        <p></p>
        <Autocomplete
          key={state.autoCompleteControl}
          data-testid="autocomplete"
          options={state.countries}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          onChange={onChange}
          onInputChange={inputValueChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="countries"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <p></p>
        <Button
          variant="contained"
          disabled={emptyorundefined}
          onClick={onAddClicked}
        >
          Add Advisory
        </Button>
      </CardContent>
    </ThemeProvider>
  );
};
export default AddAdvisory;
