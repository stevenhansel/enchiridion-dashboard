import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import debounce from "lodash/debounce";

import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Typography,
  Autocomplete,
  Snackbar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { CreateDevice, UserFilterOption } from "../types/store";
import { AppDispatch } from "../store";
import { deviceApi } from "../services/device";
import { setCreateDevice } from "../store/device";
import { ApiErrorResponse } from "../services/error";
import { RootState } from "../store";

import { useLazyGetBuildingsQuery } from "../services/building";
import { useLazyGetFloorsQuery } from "../services/floor";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const validationSchema = yup.object({
  name: yup.string().required("Please give your device a name"),
  description: yup.string().required("Description is required"),
  floorId: yup.number().required("Please select the floor"),
});

const CreateDeviceModal = (props: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [openBuildingFilter, setOpenBuildingFilter] = useState(false);
  const [openFloorFilter, setOpenFloorFilter] = useState(false);
  const [buildingFilterOptions, setBuildingFilterOptions] = useState<
    UserFilterOption[]
  >([]);
  const [buildingFilter, setBuildingFilter] = useState<UserFilterOption | null>(
    null
  );
  const [isBuildingFilterLoading, setIsBuildingFilterLoading] = useState(false);
  const [floorFilterOptions, setFloorFilterOptions] = useState<
    UserFilterOption[]
  >([]);
  const [floorFilter, setFloorFilter] = useState<UserFilterOption | null>(null);
  const [isFloorFilterLoading, setIsFloorFilterLoading] = useState(false);
  const [state, setState] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const [getBuildings, { error, isLoading }] = useLazyGetBuildingsQuery();
  const [getFloors, { data }] = useLazyGetFloorsQuery();

  const device = useSelector((state: RootState) => state.createDevice);

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
  }, []);

  const getFloorDelayed = useMemo(() => {
    return debounce((query: string) => {
      getFloors({
        query,
        limit: 5,
        buildingId: buildingFilter !== null ? buildingFilter.id : null,
      }).then(({ data }) => {
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
  }, [buildingFilter, query]);

  console.log(device);

  const handleCreateDevice = useCallback(
    async (values: CreateDevice): Promise<void> => {
      const response = await dispatch(
        deviceApi.endpoints.createDevice.initiate({
          name: values.name,
          description: values.description,
          floorId: values.floorId,
        })
      );

      if ("data" in response) {
        dispatch(
          setCreateDevice({
            id: response.data.id,
            accessKeyId: response.data.accessKeyId,
            secretAccessKey: response.data.secretAccessKey,
          })
        );
      } else {
        setErrorMessage(
          "data" in response.error
            ? (response.error.data as ApiErrorResponse).messages[0]
            : "Network Error"
        );
      }
    },
    [dispatch]
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      floorId: null,
    },
    validationSchema: validationSchema,
    onSubmit: handleCreateDevice,
  });

  console.log(formik.values);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    if (openBuildingFilter) {
      getBuildings({ limit: 5 }).then(({ data }) => {
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
  }, [openBuildingFilter]);

  useEffect(() => {
    if (openFloorFilter && buildingFilter !== null) {
      getFloors({
        limit: 5,
        buildingId: buildingFilter !== null ? buildingFilter.id : null,
      }).then(({ data }) => {
        setFloorFilterOptions(
          data !== undefined
            ? data.contents.map((f) => ({
                id: f.id,
                name: f.name,
              }))
            : []
        );
      });
    }
  }, [openFloorFilter, buildingFilter]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box>
        <Box>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            autoComplete="off"
            onChange={(e) => formik.setFieldValue("name", e.target.value)}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ width: 220, marginRight: 1, marginBottom: 1 }}
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
            sx={{ width: 220, marginRight: 1, marginBottom: 1 }}
          />
        </Box>
        <Box>
          <Box>
            <Autocomplete
              options={buildingFilterOptions}
              open={openBuildingFilter}
              onOpen={() => {
                setOpenBuildingFilter(true);
              }}
              onClose={() => {
                setOpenBuildingFilter(false);
              }}
              loading={isBuildingFilterLoading}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              onChange={(_, inputValue) => {
                setBuildingFilterOptions([]);
                setBuildingFilter(inputValue);
              }}
              onInputChange={(_, newInputValue, reason) => {
                if (reason == "input") {
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
              value={buildingFilter}
              sx={{ width: 150, marginBottom: 1 }}
            />
          </Box>
          <Autocomplete
            options={floorFilterOptions}
            loading={isFloorFilterLoading}
            disabled={buildingFilter === null ? true : false}
            open={openFloorFilter}
            onOpen={() => {
              setOpenFloorFilter(true);
            }}
            onClose={() => {
              setOpenFloorFilter(false);
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            onChange={(_, inputValue) => {
              setFloorFilterOptions([]);
              setFloorFilter(inputValue);
              formik.setFieldValue("floorId", inputValue?.id)
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason == "input") {
                setFloorFilterOptions([]);
                setIsFloorFilterLoading(true);
                getFloorDelayed(newInputValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Floor"
                error={formik.touched.floorId && Boolean(formik.errors.floorId)}
                helperText={formik.touched.floorId && formik.errors.floorId}
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
            value={floorFilter}
            sx={{ width: 150, marginBottom: 1 }}
          />
        </Box>
        <Button variant="contained" sx={{ marginRight: 1 }} type="submit">
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
        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </form>
  );
};
export default CreateDeviceModal;
