import { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AppDispatch } from '../../store';
import { ApiErrorResponse } from '../../services/error';
import { announcementApi } from '../../services/announcement';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import { CreateAnnouncementFormContext } from './context';
import {
  initialValues,
  validationSchema,
  CreateAnnouncementFormValues,
} from './form';

const steps = [
  'Upload file',
  'Pilih lokasi Building',
  'Pilih Devices',
  'Submit',
];

const MIN_STEP = 0;
const MAX_STEP: number = steps.length;
const dateFormat = 'YYYY-MM-DD';

const CreateAnnouncementForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = useCallback(() => {
    if (activeStep === MAX_STEP) return;

    setActiveStep(p => p + 1);
  }, [activeStep]);

  const handlePrevStep = useCallback(() => {
    if (activeStep === MIN_STEP) return;

    setActiveStep(p => p - 1);
  }, [activeStep]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  const handleSubmit = useCallback(
    async (values: CreateAnnouncementFormValues) => {
      setIsLoading(true);

      const data = {
        title: values.title,
        mediaId: values.media!.id,
        startDate: dayjs(values.startDate.toUTCString()).format(dateFormat),
        endDate: dayjs(values.endDate.toUTCString()).format(dateFormat),
        notes: values.notes,
        deviceIds: values.devices,
      };

      const response = await dispatch(
        announcementApi.endpoints.createAnnouncement.initiate({
          data,
        })
      );

      if ('error' in response) {
        setErrorMessage(
          response.error && 'data' in response.error
            ? (response.error.data as ApiErrorResponse).messages[0]
            : 'Network Error'
        );
      }
      setIsLoading(false);
      navigate('/');
    },
    []
  );

  const form = useMemo(() => {
    if (activeStep === 0) {
      return <Step1 />;
    } else if (activeStep === 1) {
      return <Step2 />;
    } else if (activeStep === 2) {
      return <Step3 />;
    } else if (activeStep === 3) {
      return <Step4 />;
    }

    return <Step1 />;
  }, [activeStep]);

  return (
    <Formik
      validateOnChange
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <>
          {isLoading && <CircularProgress />}
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
                  {steps.map(label => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <CreateAnnouncementFormContext.Provider
                value={{ handleNextStep, handlePrevStep }}
              >
                <Box sx={{ marginHorizontal: 10 }}>{form}</Box>
              </CreateAnnouncementFormContext.Provider>
              <Snackbar
                open={Boolean(errorMessage)}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
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
          )}
        </>
      )}
    </Formik>
  );
};

export default CreateAnnouncementForm;
