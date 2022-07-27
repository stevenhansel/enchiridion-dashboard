import React from "react";

import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Typography,
  } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useFormik } from "formik";
import * as yup from "yup";

import { useUpdateFloorMutation } from "../services/floor";

import { UpdateFloor, Building } from '../types/store';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name is required"),
  buildingId: yup.number().required("Building is required"),
});


type Props = {
  buildingHash?: Record<number, Building>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateFloorModal = (props: Props) => {
  const { buildingHash, open, setOpen } = props;
  const [editFloor] = useUpdateFloorMutation();

  const handleChange = (e: SelectChangeEvent) => {
      formik.setFieldValue("buildingId", parseInt(e.target.value, 10));
    };

  const formik = useFormik<UpdateFloor>({
    initialValues: {
      name: "",
      buildingId: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      editFloor(values);
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Update Floor</DialogTitle>
      <DialogContent>
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
                    formik.touched.buildingId &&
                    Boolean(formik.errors.buildingId)
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
                    formik.touched.buildingId &&
                    Boolean(formik.errors.buildingId)
                  }
                  defaultValue={""}
                >
                  {buildingHash && Object.entries(buildingHash).map(([buildingId, building]) => (
                    <MenuItem key={buildingId} value={buildingId}>
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
              <Button
                variant="contained"
                // component="label"
                // onClick={formik.submitForm}
                type="submit"
                sx={{ marginRight: 1 }}
              >
                OK
              </Button>
              <Button
                variant="contained"
                component="label"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateFloorModal;
