import React, { useContext, useEffect } from "react";
import { Box, Button, Stepper, TextField, Typography } from "@mui/material";
import { CreateAnnouncementFormContext } from "./context";
import { useFormikContext, useFormik } from "formik";

import {
  CreateAnnouncementFormValues,
  initialValues,
  validationSchema,
} from "./form";

const Step1 = () => {
  const { values, errors, touched, handleSubmit, setFieldValue } =
    useFormikContext<CreateAnnouncementFormValues>();
  // const { handleNextStep } = useContext(CreateAnnouncementFormContext);

  return (
    <form
      onSubmit={handleSubmit}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ width: "100%" }}
      >
        <Box sx={{ marginBottom: 2, width: "100%" }}>
          <Typography>Title Announcement</Typography>
          <TextField
            fullWidth
            id="title"
            name="title"
            variant="standard"
            value={values.title}
            onChange={(e) => setFieldValue("title", e.target.value)}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
          />
        </Box>

        <Box sx={{ marginBottom: 2, width: "100%" }}>
          <Typography>File Announcement</Typography>
          <Button variant="contained">Upload</Button>
        </Box>

        <Box sx={{ marginBottom: 2, width: "100%" }}>
          <Typography>Durasi hari Announcement</Typography>
          <TextField
            fullWidth
            id="title"
            name="title"
            variant="standard"
            value={values.duration}
            onChange={(e) => setFieldValue("duration", e.target.value)}
            error={touched.duration && Boolean(errors.duration)}
            helperText={touched.duration && errors.duration}
          />
        </Box>

        <Box sx={{ marginBottom: 2, width: "100%" }}>
          <Typography>Notes tambahan</Typography>
          <TextField fullWidth id="notes" name="notes" variant="standard" />
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained" type="submit">
            Next
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default Step1;
