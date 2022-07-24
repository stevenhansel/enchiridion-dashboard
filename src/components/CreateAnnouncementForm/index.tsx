import React, { useCallback, useState, useEffect } from "react";
import dayjs from 'dayjs';
import { Formik } from "formik";
import { useDispatch } from "react-redux";

import {
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";

import { AppDispatch } from "../../store";
import { setBuildings } from "../../store/buildings";
import { setFloors } from "../../store/floors";

import { ApiErrorResponse } from "../../services";
import { floorApi } from "../../services/floor";
import { buildingApi } from "../../services/building";
import { announcementApi } from "../../services/announcement";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

import { CreateAnnouncementFormContext } from "./context";
import { initialValues, validationSchema, CreateAnnouncementFormValues } from "./form";

import { Building, Floor } from '../../types/store';

const steps = ["Upload file", "Pilih lokasi pengumuman", "Submit"];
const MIN_STEP = 0;
const MAX_STEP: number = steps.length;
const dateFormat = 'YYYY-MM-DD';

const CreateAnnouncementForm = () => {
  const dispatch: AppDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = useCallback(() => {
    if (activeStep === MAX_STEP) return;

    setActiveStep((p) => p + 1);
  }, [activeStep]);

  const handlePrevStep = useCallback(() => {
    if (activeStep === MIN_STEP) return;

    setActiveStep((p) => p - 1);
  }, [activeStep]);

  const handleFetchFloors = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    const response = await dispatch(
      floorApi.endpoints.getFloors.initiate("", {
        forceRefetch: true,
      })
    );

    if ("data" in response) {
      const floors: Record<number, Floor> = response.data.contents.reduce(
        (prev: Record<number, Floor>, curr: Floor) => ({
          ...prev,
          [curr.id]: curr,
        }),
        {},
      );
      dispatch(setFloors(floors))
    } else {
      setErrorMessage(
        response.error && "data" in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : "Network Error"
      );
    }

    setIsLoading(false);
  }, []);

  const handleFetchBuildings = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    const response = await dispatch(
      buildingApi.endpoints.getBuildings.initiate("")
    );

    if ("data" in response) {
      const building: Record<number, Building> = response.data.contents.reduce(
        (prev: Record<number, Building>, curr: Building) => ({
          ...prev,
          [curr.id]: curr,
        }),
        {},
      );

      dispatch(setBuildings(building));
    } else {
      setErrorMessage(
        response.error && "data" in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : "Network Error"
      );
    }
    
    setIsLoading(false);
  }, []);

  const handleSubmit = useCallback(async (values: CreateAnnouncementFormValues) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('media', values.media!.file);
    formData.append('startDate', dayjs(values.startDate).format(dateFormat));
    formData.append('endDate', dayjs(values.endDate).format(dateFormat));
    formData.append('notes', values.notes);
    formData.append('deviceIds', values.devices.join(','));

    console.log(formData);

    const response = await dispatch(
      announcementApi.endpoints.createAnnouncement.initiate({
        formData,
      })
    );

    if ('error' in response) {
      setErrorMessage(
        response.error && "data" in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : "Network Error"
      );
    }

    setIsLoading(false);
  }, []);

  const renderForm = useCallback((): JSX.Element | null => {
    if (activeStep === 0) {
      return <Step1 />;
    } else if (activeStep === 1) {
      return <Step2 />;
    } else if (activeStep === 2) {
      return <Step3 />;
    }

    return null;
  }, [activeStep]);

  const form = renderForm();

  useEffect(() => {
    handleFetchFloors();
    handleFetchBuildings();
  }, []);

  return (
    <Formik
      validateOnChange
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <>
          {isLoading && (<CircularProgress />)}
          {!isLoading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              sx={{ marginTop: 3 }}
            >
              <Box sx={{ marginBottom: 4 }}>
                <Typography variant="h5" fontWeight="bold">
                  Create Announcement Page
                </Typography>
              </Box>
              <Box sx={{ marginBottom: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <CreateAnnouncementFormContext.Provider
                value={{ handleNextStep, handlePrevStep }}
              >
                <Box sx={{ marginHorizontal: 10, width: '100%' }}>{form}</Box>
              </CreateAnnouncementFormContext.Provider>
            </Box>
          )}
        </>
      )}
    </Formik>
  );
};

export default CreateAnnouncementForm;
