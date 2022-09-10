import React, { useCallback, useContext, useEffect } from "react";
import { useFormikContext } from "formik";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { Box, Button, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { CreateAnnouncementFormContext } from "./context";
import { CreateAnnouncementFormValues } from "./form";
import { validateFormikFields } from "./util";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const fields = ["title", "media", "startDate", "endDate", "notes"];

const Step1 = () => {
  const formik = useFormikContext<CreateAnnouncementFormValues>();
  const { values, errors, touched, validateField, setFieldValue } = formik;

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
          variant="outlined"
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
              accept=".jpg,.jpeg"
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
        <DesktopDatePicker
          label="Start Date Announcement"
          inputFormat="MM/dd/yyyy"
          value={values.startDate}
          onChange={(newStartDate) => {
            let newEndDate = values.endDate;
            if (newStartDate && dayjs(newStartDate).isSameOrAfter(newEndDate)) {
              newEndDate = dayjs(newStartDate).add(1, "day").toDate();
            }

            setFieldValue("startDate", newStartDate);
            setFieldValue("endDate", newEndDate);
          }}
          renderInput={(params) => <TextField {...params} />}
          shouldDisableDate={(date) => dayjs(date).isBefore(dayjs().subtract(1, 'day'))}
        />
      </Box>
      {touched.startDate && errors.startDate ? (
        <Typography variant="caption" color={red[700]} fontSize="">
          {String(errors.startDate)}
        </Typography>
      ) : null}

      <Box sx={{ marginBottom: 2, width: "100%" }}>
        <DesktopDatePicker
          label="End Date Announcement"
          inputFormat="MM/dd/yyyy"
          value={values.endDate}
          onChange={(newDate) => setFieldValue("endDate", newDate)}
          renderInput={(params) => <TextField {...params} />}
          shouldDisableDate={(date) => dayjs(date).isSameOrBefore(values.startDate || dayjs())}
        />
      </Box>
      {touched.endDate && errors.endDate ? (
        <Typography variant="caption" color={red[700]} fontSize="">
          {String(errors.endDate)}
        </Typography>
      ) : null}

      <Box sx={{ marginBottom: 2, width: "100%" }}>
        <Typography>Notes tambahan</Typography>
        <TextField
          fullWidth
          autoComplete="off"
          id="notes"
          name="notes"
          variant="outlined"
          value={values.notes}
          onChange={(e) => setFieldValue("notes", e.target.value)}
          error={touched.notes && Boolean(errors.notes)}
        />
      </Box>
      {touched.notes && errors.notes ? (
        <Typography variant="caption" color={red[700]} fontSize="">
          {errors.notes}
        </Typography>
      ) : null}

      <Box display="flex" justifyContent="center" alignItems="center">
        <Button variant="contained" onClick={handleNextSubmission}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step1;
