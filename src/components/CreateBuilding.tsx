import React, { useState, useEffect } from "react";

import {
  Box,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";

import { useCreateBuildingMutation } from "../services/building";

import { colorBuilding } from "../types/constants";
import { ApiErrorResponse } from "../services/error";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name of the Building is required"),
  color: yup.string().required("Please select the color"),
});

type CreateBuildingType = {
  name: string;
  color: string;
};

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateBuilding = (props: Props) => {
  const [addNewBuilding, { error }] = useCreateBuildingMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik<CreateBuildingType>({
    initialValues: {
      name: "",
      color: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addNewBuilding(values);
    },
  });

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const handleChange = (e: SelectChangeEvent) => {
    formik.setFieldValue("color", e.target.value as string);
  };

  useEffect(() => {
    if (error && "data" in error) {
      setErrorMessage((error.data as ApiErrorResponse).messages[0]);
    }
  }, [error]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <TextField
            autoComplete="off"
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            variant="standard"
            sx={{ marginBottom: 2 }}
            onChange={(e) => formik.setFieldValue("name", e.target.value)}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <Box>
            <Box sx={{ minWidth: 120, marginBottom: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="color">Color</InputLabel>
                <Select
                  labelId="color"
                  id="color"
                  value={
                    formik.values.color !== null ? formik.values.color : ""
                  }
                  onChange={handleChange}
                  label="Color"
                  error={formik.touched.color && Boolean(formik.errors.color)}
                >
                  {colorBuilding &&
                    colorBuilding.map((color) => (
                      <MenuItem key={color.id} value={color.color}>
                        {color.name}
                        <FiberManualRecordIcon sx={{ color: color.color }} />
                      </MenuItem>
                    ))}
                </Select>
                {formik.touched.color && formik.errors.color ? (
                  <Typography
                    sx={{
                      fontSize: 12,
                      marginTop: 0.3754,
                      color: "#D32F2F",
                    }}
                  >
                    Color is required
                  </Typography>
                ) : null}
              </FormControl>
            </Box>
            <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
              OK
            </Button>
          </Box>
          <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={6000}
            onClose={handleClose}
            message={errorMessage}
            action={action}
          />
        </Box>
      </form>
    </>
  );
};

export default CreateBuilding;
