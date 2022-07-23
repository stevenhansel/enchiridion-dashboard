import React, { useCallback, useState } from "react";
import { Formik } from "formik";

import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

import { CreateAnnouncementFormContext } from "./context";
import { initialValues, validationSchema } from "./form";

const steps = ["Upload file", "Pilih lokasi pengumuman", "Submit"];
const MIN_STEP = 0;
const MAX_STEP: number = steps.length;

const CreateAnnouncementForm = () => {
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
      validateOnChange
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {() => (
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
