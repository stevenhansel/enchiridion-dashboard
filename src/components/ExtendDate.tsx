import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";
import { red } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { useCreateRequestMutation } from "../services/request";

import { ApiErrorResponse } from "../services/error";
import { ActionCreateRequest } from "../types/store";

const validationSchema = yup.object({
  extendedEndDate: yup
    .date()
    .min(new Date(), "extend date cannot be in the past")
    .required("extend date is required"),
});

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date;
};

const ExtendDate = (props: Props) => {
  const [createRequest, { error }] = useCreateRequestMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState("");
  const { announcementId = "" } = useParams();

  const today = dayjs(props.date);
  const tomorrow = dayjs(props.date).add(1, "day").toDate();

  const formik = useFormik<ActionCreateRequest>({
    initialValues: {
      action: "extend_date",
      extendedEndDate: dayjs(tomorrow.toDateString()).format("YYYY-MM-DD"),
      announcementId: parseInt(announcementId, 10),
      description: description,
      deviceIds: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createRequest(values);
      props.setOpen(false);
    },
  });

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    if (description !== null) {
      setDescription(
        `Announcement extended to ${formik.values.extendedEndDate}`
      );
    }
    formik.setFieldValue("description", description);
  }, [description, formik.values.extendedEndDate]);

  useEffect(() => {
    if (error && "data" in error) {
      setErrorMessage((error.data as ApiErrorResponse).messages[0]);
    }
  }, [error]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Box sx={{marginBottom: 1}}>
            <DesktopDatePicker
              label="Extend Date Announcement"
              inputFormat="MM/dd/yyyy"
              value={dayjs(formik.values.extendedEndDate).format("YYYY-MM-DD")}
              onChange={(newDate) =>
                formik.setFieldValue(
                  "extendedEndDate",
                  dayjs(newDate).format("YYYY-MM-DD")
                )
              }
              renderInput={(params) => <TextField {...params} />}
              shouldDisableDate={(date) => dayjs(date).isSameOrBefore(today)}
            />
          </Box>
          {formik.touched.extendedEndDate && formik.errors.extendedEndDate ? (
            <Typography variant="caption" color={red[700]} fontSize="">
              {String(formik.errors.extendedEndDate)}
            </Typography>
          ) : null}
          <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
            OK
          </Button>
          <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={6000}
            onClose={() => setErrorMessage("")}
            message={errorMessage}
            action={
              <>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            }
          />
        </Box>
      </form>
    </>
  );
};

export default ExtendDate;
