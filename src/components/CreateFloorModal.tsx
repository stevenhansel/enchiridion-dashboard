import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

import {
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useFormik } from "formik";
import * as yup from "yup";

import { useCreateFloorMutation } from "../services/floor";
import { useLazyGetBuildingsQuery } from "../services/building";

import { CreateFloor, UserFilterOption } from "../types/store";

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
  const [getBuildings, { data, isLoading, error }] = useLazyGetBuildingsQuery();
  const [addNewFloor] = useCreateFloorMutation();

  const [open, setOpen] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState<UserFilterOption | null>(
    null
  );
  const [buildingFilterOptions, setBuildingFilterOptions] = useState<
    UserFilterOption[]
  >([]);
  const [isBuildingFilterLoading, setIsBuildingFilterLoading] = useState(false);

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

  const getBuildingDelayed = useMemo(() => {
    return debounce((query: string) => {
      getBuildings({ limit: 5 }).then(({ data }) =>
        setBuildingFilterOptions(
          data !== undefined
            ? data.map((b) => ({
                id: b.id,
                name: b.name,
              }))
            : []
        )
      );
      setIsBuildingFilterLoading(false);
    }, 250);
  }, []);

  useEffect(() => {
    if (open) {
      getBuildings({ limit: 5 }).then(({ data }) =>
        setBuildingFilterOptions(
          data !== undefined
            ? data.map((b) => ({
                id: b.id,
                name: b.name,
              }))
            : []
        )
      );
    }
  }, [open]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box>
        <TextField
          margin="dense"
          id="name"
          label="Name"
          fullWidth
          variant="standard"
          autoComplete="off"
          sx={{ marginBottom: 2 }}
          onChange={(e) => formik.setFieldValue("name", e.target.value)}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <Box sx={{ marginBottom: 2 }}>
          <Autocomplete
            open={open}
            onClose={() => {
              setOpen(false);
            }}
            onOpen={() => {
              setOpen(true);
            }}
            options={buildingFilterOptions}
            value={buildingFilter}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            onChange={(_, inputValue) => {
              setBuildingFilterOptions([]);
              setBuildingFilter(inputValue);
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === "input") {
                getBuildingDelayed(newInputValue);
                setBuildingFilterOptions([]);
                setIsBuildingFilterLoading(true);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Building"
                error={
                  formik.touched.buildingId && Boolean(formik.errors.buildingId)
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isBuildingFilterLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          {formik.touched.buildingId && formik.errors.buildingId ? (
            <Typography
              sx={{ fontSize: 12, marginTop: 0.3754, color: "#D32F2F" }}
            >
              Building is required
            </Typography>
          ) : null}
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
      </Box>
    </form>
  );
};

export default CreateFloorModal;
