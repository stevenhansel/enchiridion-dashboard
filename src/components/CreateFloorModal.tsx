import React, { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useFormik } from "formik";
import * as yup from "yup";

import { useCreateFloorMutation } from "../services/floor";
import { useGetBuildingsQuery } from "../services/building";

import { Building, CreateFloor } from "../types/store";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name is required"),
  buildingId: yup.string().required("Building is required"),
});

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateFloorModal = (props: Props) => {
  const { data, isLoading, error } = useGetBuildingsQuery(null);
  const [addNewFloor] = useCreateFloorMutation();

  const formik = useFormik<CreateFloor>({
    initialValues: {
      name: "",
      buildingId: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addNewFloor(values);
      props.setOpen(false);
    },
  });

  const handleChange = (e: SelectChangeEvent) => {
    formik.setFieldValue("buildingId", parseInt(e.target.value, 10));
  };

  console.log(formik.values);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box>
        <TextField
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
              {data &&
                data.map((building) => (
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
        </Box>
      </Box>
    </form>
  );
};

export default CreateFloorModal;
