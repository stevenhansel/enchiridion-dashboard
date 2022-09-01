import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Snackbar,
  IconButton,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";

import {
  useGetBuildingsQuery,
  useUpdateBuildingMutation,
} from "../services/building";

import { colorBuilding } from "../types/constants";
import { ApiErrorResponse } from "../services/error";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name of the Building is required"),
  buildingId: yup.string().required("Please choose the building"),
  color: yup.string().required("Please select the color"),
});

type CreateBuildingType = {
  name: string;
  buildingId: string;
  color: string;
};

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateBuilding = (props: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { data, isLoading, error } = useGetBuildingsQuery(null);
  const [updateBuilding, { error: isUpdateBuildingsError }] =
    useUpdateBuildingMutation();

  const formik = useFormik<CreateBuildingType>({
    initialValues: {
      name: "",
      buildingId: "",
      color: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateBuilding(values);
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

  useEffect(() => {
    if (isUpdateBuildingsError && "data" in isUpdateBuildingsError) {
      setErrorMessage(
        (isUpdateBuildingsError.data as ApiErrorResponse).messages[0]
      );
    }
  }, [isUpdateBuildingsError]);

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
          <Box sx={{ minWidth: 120, marginBottom: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="color">Color</InputLabel>
              <Select
                labelId="color"
                id="color"
                value={formik.values.color !== null ? formik.values.color : ""}
                onChange={(e: SelectChangeEvent) => {
                  formik.setFieldValue("color", e.target.value);
                }}
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
          <Box>
            <Box sx={{ minWidth: 120, marginBottom: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="building">Building</InputLabel>
                <Select
                  labelId="building"
                  id="building"
                  defaultValue=""
                  value={
                    formik.values.buildingId !== null
                      ? formik.values.buildingId
                      : ""
                  }
                  onChange={(e: SelectChangeEvent) => {
                    formik.setFieldValue("buildingId", e.target.value);
                  }}
                  label="Building"
                  error={
                    formik.touched.buildingId &&
                    Boolean(formik.errors.buildingId)
                  }
                >
                  {data &&
                    data.map((building) => (
                      <MenuItem
                        key={building.id}
                        value={building.id.toString()}
                      >
                        {building.name}
                      </MenuItem>
                    ))}
                </Select>
                {formik.touched.buildingId && formik.errors.buildingId ? (
                  <Typography
                    sx={{
                      fontSize: 12,
                      marginTop: 0.3754,
                      color: "#D32F2F",
                    }}
                  >
                    Choose the building please
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

export default UpdateBuilding;
