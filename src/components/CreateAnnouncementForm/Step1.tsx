import React, { useCallback, useContext, useEffect } from 'react';
import { Box, Button, Stepper, TextField, Typography } from '@mui/material';
import { CreateAnnouncementFormContext } from './context';
import { useFormikContext, useFormik } from 'formik';

import {
  CreateAnnouncementFormValues,
  initialValues,
  validationSchema,
} from './form';

const fields = ['title', 'duration'];

const Step1 = () => {
  const {
    values,
    errors,
    touched,
    validateField,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<CreateAnnouncementFormValues>();
  const { handleNextStep } = useContext(CreateAnnouncementFormContext);

  const handleSubmission = useCallback(() => {
    fields.forEach((field) => validateField(field));
    /**
     * for (const field of fields) {
     *    validateField(field)
     * }
     */

    // "errors": {
    //   "title": "title ga boleh kosong",
    //   "duration": "duration mesti lebih dari 3 hari",
    // }

    // Object.keys() ["title", "duration"]
    // Object.values() ["title ga boleh kosong", "duration mesti lebih dari 3 hari"]
    // Object.entries() [["title", "title ga boleh kosong"], ["duration", "duration mesti lebih dari 3 hari"]]

    const fieldErrors = Object.keys(errors).filter((key) =>
      fields.includes(key)
    );

    if (fieldErrors.length > 0) {
      fieldErrors.forEach((field) => setFieldTouched(field));
    } else {
      handleNextStep();
    }
  }, [handleNextStep, errors, validateField, setFieldTouched]);

  console.log('errors', errors);
  console.log('touched', touched);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{ width: '100%' }}
    >
      <Box sx={{ marginBottom: 2, width: '100%' }}>
        <Typography>Title Announcement</Typography>
        <TextField
          fullWidth
          id="title"
          name="title"
          variant="standard"
          value={values.title}
          onChange={(e) => setFieldValue('title', e.target.value)}
          error={touched.title && Boolean(errors.title)}
          helperText={touched.title && errors.title}
        />
      </Box>

      <Box sx={{ marginBottom: 2, width: '100%' }}>
        <Typography>File Announcement</Typography>
        <Button variant="contained">Upload</Button>
      </Box>

      <Box sx={{ marginBottom: 2, width: '100%' }}>
        <Typography>Durasi hari Announcement</Typography>
        <TextField
          fullWidth
          id="title"
          name="title"
          variant="standard"
          value={values.duration}
          onChange={(e) => setFieldValue('duration', e.target.value)}
          error={touched.duration && Boolean(errors.duration)}
          helperText={touched.duration && errors.duration}
        />
      </Box>

      <Box sx={{ marginBottom: 2, width: '100%' }}>
        <Typography>Notes tambahan</Typography>
        <TextField fullWidth id="notes" name="notes" variant="standard" />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Button variant="contained" onClick={handleSubmission}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step1;
