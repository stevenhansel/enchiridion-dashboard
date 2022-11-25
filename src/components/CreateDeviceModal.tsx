import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import debounce from "lodash/debounce";

import {
  Box,
  ButtonGroup,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Snackbar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

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

type CreateDeviceType = {
  name: string;
  description: string;
  floorId: number | null;
  buildingId: number | null;
  carouselSpeedMs: number;
};

const validationSchema = yup.object({
  name: yup
    .string()
    .min(5, "Minimum character for device name is 5")
    .max(6, "Name of the device cannot be more that 6 character")
    .required("Please give your device a name"),
  description: yup
    .string()
    .min(10, "Minimum character for description is 10")
    .max(30, "Maximum character for description has been reached")
    .required("Description is required"),
  floorId: yup.number().required("Please select the floor"),
  buildingId: yup.number().required(),
  carouselSpeedMs: yup
    .number()
    .min(10000, "Minimum duration is 10 seconds")
    .max(180000, "Maximum duration is 180 seconds/3 minutes")
    .required("required"),
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
  const [carouselSpeed, setCarouselSpeed] = useState(10000);

  const dispatch: AppDispatch = useDispatch();
  const [getBuildings, { error: isGetBuildingsError, isLoading }] =
    useLazyGetBuildingsQuery();
  const [getFloors, { error: isGetFloorsError }] = useLazyGetFloorsQuery();

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

  const handleCreateDevice = useCallback(
    async (values: CreateDevice): Promise<void> => {
      const response = await dispatch(
        deviceApi.endpoints.createDevice.initiate({
          name: values.name,
          description: values.description,
          floorId: values.floorId,
          carouselSpeedMs: values.carouselSpeedMs,
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
        setState(true);
      } else {
        setErrorMessage(
          "data" in response.error
            ? (response.error.data as ApiErrorResponse).messages[0]
            : "Network Error"
        );
        setState(false);
      }
    },
    [dispatch]
  );

  const formik = useFormik<CreateDeviceType>({
    initialValues: {
      name: "",
      description: "",
      floorId: null,
      buildingId: null,
      carouselSpeedMs: carouselSpeed,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      handleCreateDevice(values);
    },
  });

  const handleIncreaseCarouselSpeed = useCallback(() => {
    setCarouselSpeed((carouselSpeed) => carouselSpeed + 1000);
  }, [carouselSpeed]);

  const handleDecreaseCarouselSpeed = useCallback(() => {
    setCarouselSpeed((carouselSpeed) => carouselSpeed - 1000);
  }, [carouselSpeed]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    formik.setFieldValue("carouselSpeedMs", carouselSpeed);
  }, [carouselSpeed]);

  useEffect(() => {
    if (openBuildingFilter) {
      getBuildings({ limit: 5, query: buildingFilter?.name }).then(
        ({ data }) => {
          setBuildingFilterOptions(
            data !== undefined
              ? data.map((b) => ({
                  id: b.id,
                  name: b.name,
                }))
              : []
          );
        }
      );
    }
  }, [openBuildingFilter]);

  useEffect(() => {
    if (openFloorFilter && buildingFilter !== null) {
      getFloors({
        limit: 5,
        buildingId: buildingFilter !== null ? buildingFilter.id : null,
        query: floorFilter?.name,
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
  }, [getFloors, openFloorFilter, buildingFilter]);

  useEffect(() => {
    if (isGetBuildingsError && "data" in isGetBuildingsError) {
      setErrorMessage(
        (isGetBuildingsError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isGetFloorsError && "data" in isGetFloorsError) {
      setErrorMessage((isGetFloorsError.data as ApiErrorResponse).messages[0]);
    }
  }, [isGetBuildingsError, isGetFloorsError]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {state ? (
        <Box>
          <Box>
            <Typography fontWeight="bold">NOTICE!</Typography>
            <Typography sx={{ marginBottom: 1 }}>
              Please Screenshot the access code and give them to BM! Don't lose
              them!
            </Typography>
          </Box>

          <Box display="flex" flexDirection="row">
            <Typography>The ID: &nbsp;</Typography>
            <Typography fontWeight="bold">{device?.id}</Typography>
          </Box>
          <Box display="flex" flexDirection="row">
            <Typography>Access Key ID: &nbsp;</Typography>
            <Typography fontWeight="bold">{device?.accessKeyId}</Typography>
          </Box>
          <Box display="flex" flexDirection="row" sx={{ marginBottom: 1 }}>
            <Typography>Secret Access Key: &nbsp;</Typography>
            <Typography fontWeight="bold">{device?.secretAccessKey}</Typography>
          </Box>
          <Button
            onClick={() => {
              props.setOpen(false);
            }}
            variant="contained"
          >
            Ok
          </Button>
        </Box>
      ) : (
        <>
          <Box>
            <Typography>Name</Typography>
            <TextField
              id="name"
              variant="standard"
              autoComplete="off"
              onChange={(e) => formik.setFieldValue("name", e.target.value)}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ marginRight: 1, marginBottom: 2 }}
              fullWidth
            />
          </Box>
          <Box display="flex" flexDirection="row">
            <Box sx={{ marginBottom: 1, marginRight: 1 }}>
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
                  formik.setFieldValue("buildingId", inputValue?.id);
                }}
                onInputChange={(_, newInputValue, reason) => {
                  if (reason === "input") {
                    setBuildingFilterOptions([]);
                    setIsBuildingFilterLoading(true);
                    getBuildingDelayed(newInputValue);
                  }
                }}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Building"
                    fullWidth
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
                    error={
                      formik.touched.buildingId &&
                      Boolean(formik.errors.buildingId)
                    }
                  />
                )}
                value={buildingFilter}
                sx={{ width: 220 }}
              />
              {formik.touched.buildingId && formik.errors.buildingId ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    marginTop: "3px",
                    marginRight: "14px",
                    marginLeft: "14px",
                    color: "#D32F2F",
                    marginBottom: 1,
                  }}
                >
                  Please select the building
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ marginBottom: 1 }}>
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
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                onChange={(_, inputValue) => {
                  setFloorFilterOptions([]);
                  setFloorFilter(inputValue);
                  formik.setFieldValue("floorId", inputValue?.id);
                }}
                onInputChange={(_, newInputValue, reason) => {
                  if (reason === "input") {
                    setFloorFilterOptions([]);
                    setIsFloorFilterLoading(true);
                    getFloorDelayed(newInputValue);
                  }
                }}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Floor"
                    fullWidth
                    error={
                      formik.touched.floorId && Boolean(formik.errors.floorId)
                    }
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
                sx={{ width: 220 }}
              />
              {formik.touched.floorId && formik.errors.floorId ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    marginTop: "3px",
                    marginRight: "14px",
                    marginLeft: "14px",
                    color: "#D32F2F",
                    marginBottom: 1,
                  }}
                >
                  Please select the floor
                </Typography>
              ) : null}
            </Box>
          </Box>
          <Box>
            <Typography>Description</Typography>
            <TextField
              id="description"
              variant="standard"
              autoComplete="off"
              onChange={(e) =>
                formik.setFieldValue("description", e.target.value)
              }
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              sx={{ marginRight: 1, marginBottom: 1 }}
              fullWidth
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <Typography>Announcement Transition Speed:</Typography>
                <TextField
                  id="carousel-speed"
                  autoComplete="off"
                  onChange={(e) => {
                    setCarouselSpeed(Number(e.target.value) * 1000);
                    formik.setFieldValue("carouselSpeedMs", carouselSpeed);
                  }}
                  error={
                    formik.touched.carouselSpeedMs &&
                    Boolean(formik.errors.carouselSpeedMs)
                  }
                  value={formik.values.carouselSpeedMs / 1000}
                  sx={{ width: "80px" }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  "& > *": {
                    m: 1,
                  },
                }}
              >
                <ButtonGroup
                  orientation="vertical"
                  aria-label="vertical outlined button group"
                >
                  <Button
                    key="up"
                    onClick={handleIncreaseCarouselSpeed}
                    variant="contained"
                    sx={{ marginBottom: 1 }}
                  >
                    <KeyboardArrowUpIcon />
                  </Button>
                  <Button
                    key="down"
                    onClick={handleDecreaseCarouselSpeed}
                    variant="contained"
                  >
                    <KeyboardArrowDownIcon />
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
            {formik.touched.carouselSpeedMs && formik.errors.carouselSpeedMs ? (
              <Typography
                sx={{
                  fontSize: "12px",
                  marginTop: "3px",
                  marginRight: "14px",
                  color: "#D32F2F",
                  marginBottom: 1,
                }}
              >
                {formik.errors.carouselSpeedMs}{" "}
              </Typography>
            ) : null}
          </Box>
        </>
      )}

      {state ? null : (
        <Box sx={{ marginTop: 1 }}>
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
        </Box>
      )}
      <Box>
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
