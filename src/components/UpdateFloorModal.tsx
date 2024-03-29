import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import {
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
  IconButton,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useUpdateFloorMutation } from '../services/floor';
import { useLazyGetBuildingsQuery } from '../services/building';
import { ApiErrorResponse, isApiError, isReduxError } from '../services/error';
import { UpdateFloor, UserFilterOption } from '../types/store';

const validationSchema = yup.object({
  name: yup.string().min(1).required('Name is required'),
  buildingId: yup.string().required('Building is required'),
});

type Props = {
  floorId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateFloorModal = (props: Props) => {
  const { floorId, setOpen } = props;
  const [openBuildingModal, setOpenBuildingModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [buildingFilter, setBuildingFilter] = useState<UserFilterOption | null>(
    null
  );
  const [buildingFilterOptions, setBuildingFilterOptions] = useState<
    UserFilterOption[]
  >([]);
  const [isBuildingFilterLoading, setIsBuildingFilterLoading] = useState(false);

  const [getBuildings, { error: isBuildingError }] = useLazyGetBuildingsQuery();

  const [editFloor] = useUpdateFloorMutation();

  const formik = useFormik<UpdateFloor>({
    initialValues: {
      name: '',
      floorId: floorId,
      buildingId: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        await editFloor(values).unwrap();
        setOpen(false);
      } catch (err) {
        if (isReduxError(err) && isApiError(err.data)) {
          const { errorCode, messages } = err.data;
          const [message] = messages;
          if (errorCode === 'FLOOR_NOT_FOUND') {
            setErrorMessage(message);
          } else if (errorCode === 'FLOOR_NAME_ALREADY_EXISTS') {
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
  };

  const getBuildingDelayed = useMemo(() => {
    return debounce((query: string) => {
      getBuildings({ query, limit: 5 }).then(({ data }) => {
        setBuildingFilterOptions(
          data !== undefined
            ? data.map(b => ({
                id: b.id,
                name: b.name,
              }))
            : []
        );
        setIsBuildingFilterLoading(false);
      });
    }, 250);
  }, [getBuildings]);

  useEffect(() => {
    if (isBuildingError && 'data' in isBuildingError) {
      setErrorMessage((isBuildingError.data as ApiErrorResponse).messages[0]);
    }
  }, [isBuildingError]);

  useEffect(() => {
    if (openBuildingModal) {
      getBuildings({
        limit: 5,
        query: buildingFilter?.name,
      }).then(({ data }) =>
        setBuildingFilterOptions(
          data !== undefined
            ? data.map(b => ({
                id: b.id,
                name: b.name,
              }))
            : []
        )
      );
    }
  }, [getBuildings, openBuildingModal]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography>Name</Typography>
      <Box>
        <TextField
          margin="dense"
          id="name"
          fullWidth
          autoComplete="off"
          variant="standard"
          sx={{ marginBottom: 2 }}
          onChange={e => formik.setFieldValue('name', e.target.value)}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <Box sx={{ marginBottom: 2 }}>
          <Autocomplete
            open={openBuildingModal}
            onOpen={() => setOpenBuildingModal(true)}
            onClose={() => setOpenBuildingModal(false)}
            options={buildingFilterOptions}
            value={buildingFilter}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            onChange={(_, inputValue) => {
              setBuildingFilterOptions([]);
              setBuildingFilter(inputValue);
              formik.setFieldValue('buildingId', inputValue?.id);
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === 'input') {
                setBuildingFilterOptions([]);
                getBuildingDelayed(newInputValue);
                setIsBuildingFilterLoading(true);
              }
            }}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              );
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Building"
                error={
                  formik.touched.buildingId && Boolean(formik.errors.buildingId)
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isBuildingFilterLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          {formik.touched.buildingId && Boolean(formik.errors.buildingId) ? (
            <Typography
              sx={{
                fontSize: '12px',
                marginTop: '3px',
                marginRight: '14px',
                color: '#D32F2F',
              }}
            >
              {formik.touched.buildingId && formik.errors.buildingId}
            </Typography>
          ) : null}
        </Box>
        <Box>
          <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
            OK
          </Button>
          <Button
            variant="contained"
            component="label"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </Box>
        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={() => setErrorMessage('')}
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
  );
};

export default UpdateFloorModal;
