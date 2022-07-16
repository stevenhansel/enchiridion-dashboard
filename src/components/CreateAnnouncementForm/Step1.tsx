import React, { useCallback, useContext, useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { CreateAnnouncementFormContext } from "./context";
import { useFormikContext } from "formik";

import { CreateAnnouncementFormValues } from "./form";
import { validateFormikFields } from "./util";

const fields = ["title", "duration", "media", "notes"];

const Step1 = () => {
  const formik = useFormikContext<CreateAnnouncementFormValues>();
  const { values, errors, touched, validateField, setFieldValue } = formik;

  const [startValue, setStartValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);

  const { handleNextStep } = useContext(CreateAnnouncementFormContext);

  const handleUploadImage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const files = event.currentTarget.files;
        if (files === null) {
          throw new Error("Something went wrong when reading the image");
        }
        const file = files.item(0);
        if (file === null) {
          throw new Error("Something went wrong when reading the image");
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          if (!e.target || (e.target && !e.target.result))
            throw new Error("Something went wrong when reading the image");

          const image = new Image();
          image.onload = () => {
            setFieldValue("media", { file, image });
          };
          image.onerror = () => {
            throw new Error("Something went wrong when reading the image");
          };
          image.src = e.target.result as string;
        };
        reader.onerror = () => {
          throw new Error("Something went wrong when reading the file");
        };

        reader.readAsDataURL(file);
      } catch (e) {
        if (e instanceof Error) {
          // setError(e.message);
        }
      }
    },
    [setFieldValue]
  );

  const handleNextSubmission = useCallback(() => {
    const errors = validateFormikFields(formik, fields);
    if (errors.length > 0) return;

    handleNextStep();
  }, [formik, handleNextStep]);

  useEffect(() => {
    fields.forEach((field) => validateField(field));
    // eslint-disable-next-line
  }, []);

  return (
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
        />

        {touched.title && errors.title ? (
          <Typography variant="caption" color={red[700]} fontSize="">
            {errors.title}
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ marginBottom: 2, width: "100%" }}>
        <Typography>File Announcement</Typography>
        <Box display="flex" gap={10}>
          <Button variant="contained" component="label">
            Upload
            <input
              type="file"
              hidden
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleUploadImage(e)}
            />
          </Button>

          {values.media !== null ? (
            <Typography>{values.media.file.name}</Typography>
          ) : null}
        </Box>

        {touched.media && errors.media ? (
          <Typography variant="caption" color={red[700]} fontSize="">
            {errors.media}
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ marginBottom: 2, width: "100%" }}>
        <Typography>Start Date Announcement</Typography>
        <TextField
          fullWidth
          id="title"
          name="title"
          variant="standard"
          value={values.duration}
          onChange={(e) => setFieldValue("duration", e.target.value)}
          error={touched.duration && Boolean(errors.duration)}
        />
      </Box>

      <Box sx={{ marginBottom: 2, width: "100%" }}>
        <Typography>End Date Announcement</Typography>
      </Box>

      <Box sx={{ marginBottom: 2, width: "100%" }}>
        <Typography>Notes tambahan</Typography>
        <TextField fullWidth id="notes" name="notes" variant="standard" />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Button variant="contained" onClick={handleNextSubmission}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step1;
