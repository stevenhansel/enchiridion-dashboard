import React, { useEffect, useState, useMemo, useCallback } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Snackbar,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";
import debounce from "lodash/debounce";

import {
  useLazyGetBuildingsQuery,
  useUpdateBuildingMutation,
} from "../services/building";

import { useLazyGetFloorsQuery } from "../services/floor";

import { colorBuilding } from "../types/constants";
import { UserFilterOption } from "../types/store";

import { ApiErrorResponse } from "../services/error";

import { usePermission } from "../hooks";

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
  const [open, setOpen] = useState(false);
  const [buildingFilterOptions, setBuildingFilterOptions] = useState<
    UserFilterOption[]
  >([]);

  const [isBuildingFilterLoading, setIsBuildingFilterLoading] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState<UserFilterOption | null>(
    null
  );

  const hasPermissionViewBuilding = usePermission("view_list_building");

  const [getFloors, { data: floors }] = useLazyGetFloorsQuery();

  const [
    getBuildings,
    {
      data: buildings,
      error: isGetBuildingsError,
      isLoading: isBuildingsLoading,
    },
  ] = useLazyGetBuildingsQuery();

  const [updateBuilding, { error: isUpdateBuildingsError }] =
    useUpdateBuildingMutation();

  const getBuildingDelayed = useMemo(() => {
    return debounce((query: string) => {
      getBuildings({ query, limit: 5 }).then(({ data }) => {
        setBuildingFilterOptions(
          data !== undefined
            ? data.map((b) => ({
                id: b.id,
                name: b.name,
              }))
            : []
        );
        setIsBuildingFilterLoading(false);
      });
    }, 250);
  }, [getBuildings]);

  const handleChange = useCallback(() => {
    getFloors({ limit: 20 });
    console.log("changed!");
  }, [buildings, getBuildings]);

  const formik = useFormik<CreateBuildingType>({
    initialValues: {
      name: "",
      buildingId: "",
      color: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateBuilding(values);
      // props.setOpen(false);
      handleChange();
    },
  });

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    if (isUpdateBuildingsError && "data" in isUpdateBuildingsError) {
      setErrorMessage(
        (isUpdateBuildingsError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isGetBuildingsError && "data" in isGetBuildingsError) {
      setErrorMessage(
        (isGetBuildingsError.data as ApiErrorResponse).messages[0]
      );
    }
  }, [isUpdateBuildingsError, isGetBuildingsError]);

  useEffect(() => {
    if (hasPermissionViewBuilding && open) {
      getBuildings({
        limit: 5,
      }).then(({ data }) => {
        setBuildingFilterOptions(
          data !== undefined
            ? data.map((b) => ({
                id: b.id,
                name: b.name,
              }))
            : []
        );
      });
    }
  }, [hasPermissionViewBuilding, buildingFilter, open]);

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
              <InputLabel
                id="color"
                sx={{
                  color:
                    formik.touched.color && Boolean(formik.errors.color)
                      ? "#D32F2F"
                      : null,
                }}
              >
                Color
              </InputLabel>
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
                    fontSize: "12px",
                    marginTop: "3px",
                    marginRight: "14px",
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
              <Autocomplete
                options={buildingFilterOptions}
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                loading={isBuildingFilterLoading}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                onChange={(_, inputValue) => {
                  setBuildingFilterOptions([]);
                  setBuildingFilter(inputValue);
                  formik.setFieldValue("buildingId", inputValue?.id);
                }}
                onInputChange={(_, newInputValue, reason) => {
                  if (reason === "input") {
                    setBuildingFilterOptions([]);
                    setIsBuildingFilterLoading(true);
                    getBuildingDelayed(newInputValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Building"
                    error={
                      formik.touched.buildingId &&
                      Boolean(formik.errors.buildingId)
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
                value={buildingFilter}
              />
              {formik.touched.buildingId && formik.errors.buildingId ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    marginTop: "3px",
                    marginRight: "14px",
                    color: "#D32F2F",
                  }}
                >
                  Please select the building
                </Typography>
              ) : null}
            </Box>
            <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
              OK
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
    </>
  );
};

export default UpdateBuilding;
