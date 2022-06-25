import React, { useCallback, useState } from "react";

import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { Formik, useFormik } from "formik";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

import { CreateAnnouncementFormContext } from "./context";
import { initialValues, validationSchema } from "./form";

const MAX_STEP = 2;
const MIN_STEP = 0;

const CreateAnnouncementForm = () => {
  const steps = ["Upload file", "Pilih lokasi pengumuman", "Submit"];

  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = useCallback(() => {
    if (activeStep === MAX_STEP) return;

    setActiveStep((p) => p + 1);
  }, [activeStep]);

  const handlePrevStep = useCallback(() => {
    if (activeStep === MIN_STEP) return;

    setActiveStep((p) => p - 1);
  }, [activeStep]);

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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {handleNextStep();}}
    >
      {({ values }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          sx={{ marginTop: 3 }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Create Announcement Page
            </Typography>
          </Box>
          <span>titlenya: {values.title}</span>
          <span>durationnya: {values.duration}</span>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <CreateAnnouncementFormContext.Provider
            value={{ handleNextStep, handlePrevStep }}
          >
            <Box sx={{ width: "60%" }}>{form}</Box>
          </CreateAnnouncementFormContext.Provider>
        </Box>
      )}
    </Formik>
  );
};

export default CreateAnnouncementForm;
