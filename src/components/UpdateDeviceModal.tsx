import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Autocomplete,
  CircularProgress,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import debounce from "lodash/debounce";

import { useLazyGetFloorsQuery } from "../services/floor";

import { useLazyGetBuildingsQuery } from "../services/building";

import { useUpdateDeviceMutation } from "../services/device";

import { UserFilterOption } from "../types/store";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deviceName?: string;
};

type UpdateDeviceType = {
  name: string;
  floorId: number | null;
  description: string;
  deviceId: string;
};

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Device name required")
    .min(3, "Name should be of minimum 4 characters length"),
  description: yup.string().required("Description is required"),
  floorId: yup.number().required("Please select the floor"),
  deviceId: yup.string().required(),
});

const UpdateDeviceModal = (props: Props) => {
  const { deviceId = "" } = useParams();

  const [openBuildingFilter, setOpenBuildingFilter] = useState(false);
  const [openFloorFilter, setOpenFloorFilter] = useState(false);

  const [floorFilterOptions, setFloorFilterOptions] = useState<
    UserFilterOption[]
  >([]);
  const [floorFilter, setFloorFilter] = useState<UserFilterOption | null>(null);
  const [isFloorFilterLoading, setIsFloorFilterLoading] = useState(false);

  const [buildingFilterOptions, setBuildingFilterOptions] = useState<
    UserFilterOption[]
  >([]);
  const [buildingFilter, setBuildingFilter] = useState<UserFilterOption | null>(
    null
  );
  const [isBuildingFilterLoading, setIsBuildingFilterLoading] = useState(false);

  const [getFloors, { error: isGetFloorError, isLoading: isGetFloorLoading }] =
    useLazyGetFloorsQuery();

  const [
    getBuildings,
    { error: isGetBuildingError, isLoading: isGetBuildingLoading },
  ] = useLazyGetBuildingsQuery();

  const [updateDevice, { error, isLoading }] = useUpdateDeviceMutation();

  const getFloorDelayed = useMemo(() => {
    return debounce((query: string) => {
      getFloors({ query, limit: 5 }).then(({ data }) => {
        setFloorFilterOptions(
          data !== undefined
            ? data.contents.map((f) => ({
                id: f.id,
                name: f.name,
              }))
            : []
        );
        setIsFloorFilterLoading(false);
      });
    }, 250);
  }, []);

  const getBuildingDelayed = useMemo(() => {
    return debounce((query: string) => {
      getBuildings({ query, limit: 5 }).then(({ data }) => {
        setFloorFilterOptions(
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
  }, []);

  const formik = useFormik<UpdateDeviceType>({
    initialValues: {
      name: "",
      floorId: null,
      description: "",
      deviceId: deviceId,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateDevice(values);
    },
  });

  useEffect(() => {
    if (openFloorFilter) {
      getFloors({
        limit: 5,
        buildingId: buildingFilter !== null ? buildingFilter.id : null,
      }).then(({ data }) =>
        setFloorFilterOptions(
          data !== undefined
            ? data.contents.map((f) => ({
                id: f.id,
                name: f.name,
              }))
            : []
        )
      );
    }
  }, [getFloors, openFloorFilter]);

  useEffect(() => {
    if (openBuildingFilter) {
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
  }, [getBuildings, openBuildingFilter]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex">
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            autoComplete="off"
            onChange={(e) => formik.setFieldValue("name", e.target.value)}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ marginRight: 1, marginBottom: 1, marginTop: 1 }}
            fullWidth
          />
        </Box>
        <Box display="flex" flexDirection="row">
          <Autocomplete
            options={buildingFilterOptions}
            value={buildingFilter}
            fullWidth
            sx={{ width: 220, marginRight: 1 }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            open={openBuildingFilter}
            onOpen={() => {
              setOpenBuildingFilter(true);
            }}
            onClose={() => {
              setOpenBuildingFilter(false);
            }}
            onChange={(_, inputValue) => {
              setBuildingFilter(inputValue);
              setBuildingFilterOptions([]);
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
          <Autocomplete
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            options={floorFilterOptions}
            value={floorFilter}
            fullWidth
            sx={{ width: 220 }}
            disabled={buildingFilter === null ? true : false}
            open={openFloorFilter}
            onOpen={() => {
              setOpenFloorFilter(true);
            }}
            onClose={() => {
              setOpenFloorFilter(false);
            }}
            onChange={(_, inputValue) => {
              setFloorFilter(inputValue);
              setFloorFilterOptions([]);
              formik.setFieldValue("floorId", inputValue?.id);
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === "input") {
                setFloorFilterOptions([]);
                setIsFloorFilterLoading(true);
                getFloorDelayed(newInputValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Floor"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isFloorFilterLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Box>
        <Box>
          <TextField
            id="description"
            label="Description"
            variant="outlined"
            autoComplete="off"
            onChange={(e) =>
              formik.setFieldValue("description", e.target.value)
            }
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            sx={{ marginRight: 1, marginBottom: 1, marginTop: 1 }}
            fullWidth
          />
        </Box>

        <Button type="submit" variant="contained" sx={{ marginRight: 1 }}>
          Ok
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            props.setOpen(false);
          }}
        >
          Cancel
        </Button>
      </form>
    </>
  );
};

export default UpdateDeviceModal;
