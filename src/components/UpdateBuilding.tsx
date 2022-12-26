import React, { useEffect, useState, useMemo } from 'react';

import {
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Snackbar,
  IconButton,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  FiberManualRecord as FiberManualRecordIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import debounce from 'lodash/debounce';

import {
  useLazyGetBuildingsQuery,
  useUpdateBuildingMutation,
} from '../services/building';

import { colorBuilding } from '../types/constants';
import { UserFilterOption } from '../types/store';

import { ApiErrorResponse, isReduxError, isApiError } from '../services/error';

import { usePermission } from '../hooks';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, 'Name should be of minimum 4 characters length')
    .required('Name of the Building is required'),
  buildingId: yup.string().required('Please choose the building'),
  color: yup.string().required('Please select the color'),
});

type CreateBuildingType = {
  name: string;
  buildingId: string;
  color: string;
};

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
};

const UpdateBuilding = (props: Props) => {
  const { setOpen, setSuccessMessage } = props;
  const [errorMessage, setErrorMessage] = useState('');
  const [openDropdown, setOpenDropDown] = useState(false);
  const [buildingFilterOptions, setBuildingFilterOptions] = useState<
    UserFilterOption[]
  >([]);

  const [isBuildingFilterLoading, setIsBuildingFilterLoading] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState<UserFilterOption | null>(
    null
  );

  const hasPermissionViewBuilding = usePermission('view_list_building');

  const [
    getBuildings,
    { error: isGetBuildingsError, isLoading: isBuildingsLoading },
  ] = useLazyGetBuildingsQuery();

  const [updateBuilding, { error: isUpdateBuildingsError }] =
    useUpdateBuildingMutation();

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

  const formik = useFormik<CreateBuildingType>({
    initialValues: {
      name: '',
      buildingId: '',
      color: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        await updateBuilding(values).unwrap();
        props.setOpen(false);
        setSuccessMessage('you have successfully update a building');
      } catch (err) {
        if (isReduxError(err) && isApiError(err.data)) {
          const { errorCode, messages } = err.data;
          const [message] = messages;
          if (
            errorCode === 'BUILDING_NAME_ALREADY_EXISTS' ||
            'BUILDING_NOT_FOUND'
          ) {
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

  useEffect(() => {
    if (isUpdateBuildingsError && 'data' in isUpdateBuildingsError) {
      setErrorMessage(
        (isUpdateBuildingsError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isGetBuildingsError && 'data' in isGetBuildingsError) {
      setErrorMessage(
        (isGetBuildingsError.data as ApiErrorResponse).messages[0]
      );
    }
  }, [isUpdateBuildingsError, isGetBuildingsError]);

  useEffect(() => {
    if (hasPermissionViewBuilding && openDropdown) {
      getBuildings({
        limit: 5,
        query: buildingFilter?.name,
      }).then(({ data }) => {
        setBuildingFilterOptions(
          data !== undefined
            ? data.map(b => ({
                id: b.id,
                name: b.name,
              }))
            : []
        );
      });
    }
  }, [hasPermissionViewBuilding, openDropdown]);

  return (
    <>
      {!isBuildingsLoading ? (
        <form onSubmit={formik.handleSubmit}>
          <Box>
            <Typography>Name</Typography>
            <TextField
              autoComplete="off"
              margin="dense"
              id="name"
              variant="standard"
              onChange={e => formik.setFieldValue('name', e.target.value)}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ marginBottom: 2, width: '100%' }}
            />
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
                  value={
                    formik.values.color !== null ? formik.values.color : ''
                  }
                  onChange={(e: SelectChangeEvent) => {
                    formik.setFieldValue('color', e.target.value);
                  }}
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
            <Box>
              <Box sx={{ minWidth: 120, marginBottom: 1 }}>
                <Autocomplete
                  options={buildingFilterOptions}
                  open={openDropdown}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  loading={isBuildingFilterLoading}
                  getOptionLabel={option => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  onChange={(_, inputValue) => {
                    setBuildingFilterOptions([]);
                    setBuildingFilter(inputValue);
                    formik.setFieldValue('buildingId', inputValue?.id);
                  }}
                  onInputChange={(_, newInputValue, reason) => {
                    if (reason === 'input') {
                      setBuildingFilterOptions([]);
                      setIsBuildingFilterLoading(true);
                      getBuildingDelayed(newInputValue);
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
                        formik.touched.buildingId &&
                        Boolean(formik.errors.buildingId)
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
                  value={buildingFilter}
                />
                {formik.touched.buildingId && formik.errors.buildingId ? (
                  <Typography
                    sx={{
                      fontSize: '12px',
                      marginTop: '3px',
                      marginRight: '14px',
                      color: '#D32F2F',
                    }}
                  >
                    Please select the building
                  </Typography>
                ) : null}
              </Box>
              <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
                OK
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
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default UpdateBuilding;
