import React, { useState, useEffect } from "react";

import {
  Box,
  Button,
  Snackbar,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SelectChangeEvent } from "@mui/material/Select";
import { useFormik } from "formik";
import * as yup from "yup";

import { useUpdateFloorMutation } from "../services/floor";
import { useGetBuildingsQuery } from "../services/building";

import { UpdateFloor } from "../types/store";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name is required"),
  buildingId: yup.string().required("Building is required"),
});

type Props = {
  floorId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateFloorModal = (props: Props) => {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: buildings,
    isLoading: isBuildingLoading,
    error: isBuildingError,
  } = useGetBuildingsQuery(null);
  const [editFloor] = useUpdateFloorMutation();

  const formik = useFormik<UpdateFloor>({
    initialValues: {
      name: "",
      floorId: "",
      buildingId: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      editFloor(values);
      props.setOpen(false);
    },
  });

  const handleChange = (e: SelectChangeEvent) => {
    formik.setFieldValue("buildingId", parseInt(e.target.value, 10));
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    formik.setFieldValue("floorId", props.floorId);
  }, [props.floorId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box>
        <TextField
          margin="dense"
          id="name"
          label="Name"
          fullWidth
          autoComplete="off"
          variant="standard"
          sx={{ marginBottom: 2 }}
          onChange={(e) => formik.setFieldValue("name", e.target.value)}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <Box sx={{ marginBottom: 2 }}>
          <FormControl sx={{ width: 220 }}>
            <InputLabel
              id="building"
              error={
                formik.touched.buildingId && Boolean(formik.errors.buildingId)
              }
            >
              Building
            </InputLabel>
            <Select
              labelId="building"
              id="building"
              label="Building"
              onChange={handleChange}
              value={
                formik.values.buildingId
                  ? formik.values.buildingId.toString()
                  : ""
              }
              error={
                formik.touched.buildingId && Boolean(formik.errors.buildingId)
              }
              defaultValue={""}
            >
              {buildings &&
                buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name}
                  </MenuItem>
                ))}
            </Select>
            {formik.touched.buildingId && formik.errors.buildingId ? (
              <Typography
                sx={{ fontSize: 12, marginTop: 0.3754, color: "#D32F2F" }}
              >
                Building is required
              </Typography>
            ) : null}
          </FormControl>
        </Box>
        <Box>
          <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
            OK
          </Button>
          <Button
            variant="contained"
            component="label"
            onClick={() => props.setOpen(false)}
          >
            Close
          </Button>
        </Box>
        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
          action={
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
          }
        />
      </Box>
    </form>
  );
};

export default UpdateFloorModal;
