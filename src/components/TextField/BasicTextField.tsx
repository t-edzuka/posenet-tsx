import * as React from "react";
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

const inputIsNumber = (inputValue: string | null): boolean => {
  const result = Number(inputValue);
  return !isNaN(result);
};

export default function BasicTextFields() {
  const [milliSecond, setMilliSecond] = useState("100");
  const [inputIsValid, setValid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (inputIsNumber(event.target.value)) {
      setValid((_) => true);
      setMilliSecond(event.target.value);
    } else {
      setValid((_) => false);
      return;
    }
  };

  const handleKeyPressEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      inputRef?.current?.blur();
      event.preventDefault();
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { width: "12ch", position: "absolute" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="standard-basic"
        label="interval (ms)"
        variant="outlined"
        inputRef={inputRef}
        helperText={inputIsValid ? "OK" : "invalid value"}
        onChange={(e) => handleChange(e)}
        onKeyPress={(e) => handleKeyPressEnter(e)}
      />
      <Typography>
        {milliSecond} {"ms"}
      </Typography>
    </Box>
  );
}
