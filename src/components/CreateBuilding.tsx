import React, { useState, useEffect } from 'react';

import {
  Box,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
  Snackbar,
  IconButton,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {
  FiberManualRecord as FiberManualRecordIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { useCreateBuildingMutation } from '../services/building';

import { colorBuilding } from '../types/constants';
import { isApiError, isReduxError, ApiErrorResponse } from '../services/error';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, 'Name should be of minimum 4 characters length')
    .required('Name of the Building is required'),
  color: yup.string().required('Please select the color'),
});

type CreateBuildingType = {
  name: string;
  color: string;
};

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
};

const CreateBuilding = (props: Props) => {
  const { setOpen, setSuccessMessage } = props;
  const [addNewBuilding, { error }] = useCreateBuildingMutation();
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik<CreateBuildingType>({
    initialValues: {
      name: '',
      color: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        await addNewBuilding(values).unwrap();
        setOpen(false);
        setSuccessMessage('you have successfully created a building');
      } catch (err) {
        if (isReduxError(err) && isApiError(err.data)) {
          const { errorCode, messages } = err.data;
          const [message] = messages;
          if (errorCode === 'BUILDING_NAME_ALREADY_EXISTS') {
            setErrorMessage(message);
          }
        }
      }
    },
  });

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleChange = (e: SelectChangeEvent) => {
    formik.setFieldValue('color', e.target.value as string);
  };

  useEffect(() => {
    if (error && 'data' in error) {
      setErrorMessage((error.data as ApiErrorResponse).messages[0]);
    }
  }, [error]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Typography>Name</Typography>
        <TextField
          autoComplete="off"
          margin="dense"
          id="name"
          fullWidth
          variant="standard"
          sx={{ marginBottom: 2 }}
          onChange={e => formik.setFieldValue('name', e.target.value)}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <Box>
          <Box sx={{ minWidth: 120, marginBottom: 1 }}>
            <FormControl fullWidth>
              <InputLabel
                id="color"
                sx={{
                  color:
                    formik.touched.color && Boolean(formik.errors.color)
                      ? '#D32F2F'
                      : null,
                }}
              >
                Color
              </InputLabel>
              <Select
                labelId="color"
                id="color"
                value={formik.values.color !== null ? formik.values.color : ''}
                onChange={handleChange}
                label="Color"
                error={formik.touched.color && Boolean(formik.errors.color)}
              >
                {colorBuilding &&
                  colorBuilding.map(color => (
                    <MenuItem key={color.id} value={color.color}>
                      {color.name}
                      <FiberManualRecordIcon sx={{ color: color.color }} />
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.color && formik.errors.color ? (
                <Typography
                  sx={{
                    fontSize: '12px',
                    marginTop: '3px',
                    marginRight: '14px',
                    color: '#D32F2F',
                  }}
                >
                  Color is required
                </Typography>
              ) : null}
            </FormControl>
          </Box>
          <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={6000}
            onClose={handleClose}
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
          <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
            OK
          </Button>
        </Box>
        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={handleClose}
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
      </form>
    </>
  );
};

export default CreateBuilding;
