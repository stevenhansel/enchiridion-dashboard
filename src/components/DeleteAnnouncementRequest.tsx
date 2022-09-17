import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Box, Button, IconButton, Snackbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";

import { useCreateRequestMutation } from "../services/request";

import { ApiErrorResponse } from "../services/error";
import { ActionCreateRequest } from "../types/store";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteAnnouncementRequest = (props: Props) => {
  const [createRequest, { error }] = useCreateRequestMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState("");
  const { announcementId = "" } = useParams();

  const formik = useFormik<ActionCreateRequest>({
    initialValues: {
      action: "delete",
      extendedEndDate: null,
      announcementId: parseInt(announcementId, 10),
      description: description,
      deviceIds: [],
    },
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
      setDescription("Deleted");
    }
    formik.setFieldValue("description", description);
  }, [description, formik.values.description]);

  useEffect(() => {
    if (error && "data" in error) {
      setErrorMessage((error.data as ApiErrorResponse).messages[0]);
    }
  }, [error]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Typography sx={{marginBottom: 1}}>
            Are you sure want to delete this announcement?
          </Typography>
          <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
            Delete
          </Button>
          <Button
            variant="contained"
            onClick={() => props.setOpen(false)}
            sx={{ marginRight: 1 }}
          >
            Cancel
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

export default DeleteAnnouncementRequest;
