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
          if (file.type === "video/mp4") {
            if (!e.target || (e.target && !e.target.result))
              throw new Error("Something went wrong when reading the video");
            const video = document.createElement("video");
            video.onloadedmetadata = () => {
              setFieldValue("media", {
                file,
                image: null,
                video,
                duration: video.duration * 1000,
                type: "video",
              });
            };
            video.onerror = () => {
              throw new Error("Something went wrong when reading the video");
            };
            video.src = e.target?.result as string;
          } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
            if (!e.target || (e.target && !e.target.result))
              throw new Error("Something went wrong when reading the image");
            const image = new Image();
            image.onload = () => {
              setFieldValue("media", {
                file,
                image,
                video: null,
                duration: null,
                type: "image",
              });
            };
            image.onerror = () => {
              throw new Error("Something went wrong when reading the image");
            };
            image.src = e.target?.result as string;
          }
          reader.onerror = () => {
            throw new Error("Something went wrong when reading the file");
          };
        };

        reader.readAsDataURL(file);
      } catch (e) {
        if (e instanceof Error) {
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
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{ width: "100%" }}
    >
      <Box sx={{ marginBottom: 2, width: 500 }}>
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
      <Box sx={{ marginBottom: 2, width: 500 }}>
        <Typography>File Announcement</Typography>
        <Button
          variant="contained"
          component="label"
          color={touched.media && errors.media ? "error" : "primary"}
        >
          Upload
          <input
            type="file"
            hidden
            accept=".jpg,.jpeg,.mp4"
            onChange={(e) => handleUploadImage(e)}
          />
        </Button>

        {values.media !== null ? (
          <Typography sx={{ marginLeft: 1 }} variant="caption" fontSize="">
            {values.media.file.name}
          </Typography>
        ) : null}

        {touched.media && errors.media ? (
          <Typography
            variant="caption"
            color={red[700]}
            fontSize=""
            sx={{ marginLeft: 1 }}
          >
            {errors.media}
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ marginBottom: 2, width: 500 }}>
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
          shouldDisableDate={(date) =>
            dayjs(date).isBefore(dayjs().subtract(1, "day"))
          }
        />
      </Box>
      {touched.startDate && errors.startDate ? (
        <Typography variant="caption" color={red[700]} fontSize="">
          {String(errors.startDate)}
        </Typography>
      ) : null}

      <Box sx={{ marginBottom: 2, width: 500 }}>
        <DesktopDatePicker
          label="End Date Announcement"
          inputFormat="MM/dd/yyyy"
          value={values.endDate}
          onChange={(newDate) => setFieldValue("endDate", newDate)}
          renderInput={(params) => <TextField {...params} />}
          shouldDisableDate={(date) =>
            dayjs(date).isSameOrBefore(values.startDate || dayjs())
          }
        />
      </Box>
      {touched.endDate && errors.endDate ? (
        <Typography variant="caption" color={red[700]} fontSize="">
          {String(errors.endDate)}
        </Typography>
      ) : null}

      <Box sx={{ marginBottom: 2, width: 500 }}>
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
        {touched.notes && errors.notes ? (
          <Typography variant="caption" color={red[700]} fontSize="">
            {errors.notes}
          </Typography>
        ) : null}
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
