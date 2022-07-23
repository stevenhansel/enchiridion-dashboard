import React, { useCallback } from "react";

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
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";

import { AppDispatch, RootState } from "../store";

import { floorApi } from "../services/floor";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name is required"),
  buildingId: yup.number().required("Building is required"),
});

type UpdateFloor = {
  name: string;
  buildingId: number | null;
};

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleListFloor: () => {};
};

const CreateFloorModal = (props: Props) => {
  const buildingsState = useSelector((state: RootState) => state.buildings);

  const dispatch: AppDispatch = useDispatch();
  
  const handleCreateFloor = useCallback(
    async (values: UpdateFloor): Promise<void> => {
      await dispatch(
        floorApi.endpoints.createFloor.initiate({
          name: values.name,
          buildingId: values.buildingId,
        })
      );
      props.setOpen(false);
    },
    [dispatch, props.setOpen]
  );

  const formik = useFormik<UpdateFloor>({
    initialValues: {
      name: "",
      buildingId: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
        handleCreateFloor(values).then(props.handleListFloor);
    },
  });

  const handleChange = (e: SelectChangeEvent) => {
    formik.setFieldValue("buildingId", parseInt(e.target.value, 10));
  };

  return (
    <Dialog open={props.open} onClose={props.setOpen}>
      <DialogTitle>Create Floor</DialogTitle>
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
                  {buildingsState && Object.entries(buildingsState).map(([buildingId, building]) => (
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
                onClick={() => props.setOpen(false)}
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


export default CreateFloorModal;