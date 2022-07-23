import React, { useCallback, useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { SelectChangeEvent } from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";

import ListFloorForm from "../components/ListFloorForm";

import { AppDispatch } from "../store";

import { ApiErrorResponse } from "../services";
import { floorApi } from "../services/floor";
import { buildingApi } from "../services/building";

type Building = {
  id: number;
  name: string;
  color: string;
};

type Device = {
  id: number;
  name: string;
  description: string;
  totalAnnouncements: number;
};

type Floor = {
  id: number;
  name: string;
  building: Building;
  devices: Device[];
};

type FloorPage = {
  hasNext: boolean;
  count: number;
  pages: number;
  contents: Floor[];
};

type CreateFloor = {
  name: string;
  buildingId: number | null;
};

type Props = {
  children?: React.ReactNode;
};

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name is required"),
  buildingId: yup.number().required("Building is required"),
});

const ListFloorPage = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterById, setFilterById] = useState("");
  const [filterByBuilding, setFilterByBuilding] = useState<number | null>(null);

  const [open, setOpen] = useState(false);
  const handleOpenNewBuilding = () => setOpen(true);
  const handleCloseNewBuilding = () => setOpen(false);

  const [editFloor, setIsEditFloor] = useState(false);
  const handleOpenEditFloor = () => setIsEditFloor(true);
  const handleCloseEditFloor = () => setIsEditFloor(false);

  // const [foundUsers, setFoundUsers] = useState(floors);

  const dispatch: AppDispatch = useDispatch();

  const handleListFloor = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    const response = await dispatch(
      floorApi.endpoints.getFloors.initiate("", {
        forceRefetch: true,
      })
    );

    if ("data" in response) {
      const getFloorData: Floor[] = response.data.contents.map((data: any) => ({
        id: data.id,
        name: data.name,
        building: data.building,
        devices: data.devices,
      }));
      setIsLoading(false);
      setFloors(getFloorData);
      console.log(floors);
    } else {
      setErrorMessage(
        response.error && "data" in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : "Network Error"
      );
      setIsLoading(false);
    }
  }, []);

  const handleCreateFloor = useCallback(
    async (values: CreateFloor): Promise<void> => {
      await dispatch(
        floorApi.endpoints.createFloor.initiate({
          name: values.name,
          buildingId: values.buildingId,
        })
      );
      setOpen(false);
    },
    [open]
  );

  const handleChange = (e: SelectChangeEvent) => {
    formik.setFieldValue("buildingId", parseInt(e.target.value, 10));
  };

  const handleCreateBuilding = useCallback(async (): Promise<void> => {
    const response = await dispatch(
      buildingApi.endpoints.getBuildings.initiate("")
    );
    const buildingList: Building[] = response.data.contents.map(
      (data: any) => ({
        id: data.id,
        name: data.name,
        color: data.color,
      })
    );
    setBuildings(buildingList);
  }, []);

  const formik = useFormik<CreateFloor>({
    initialValues: {
      name: "",
      buildingId: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleCreateFloor(values).then(handleListFloor);
    },
  });

  useEffect(() => {
    handleListFloor();
    handleCreateBuilding();
  }, []);

  console.log(filterById, "Id");
  console.log(filterByBuilding, "building");
  

  return (
    <Box>
      <ListFloorForm />
      <Dialog open={open} onClose={handleCloseNewBuilding}>
        <DialogTitle>Create Floor</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Box>
              <TextField
                margin="dense"
                id="name"
                label="Name"
                fullWidth
                variant="standard"
                sx={{ marginBottom: 2 }}
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <Box sx={{ marginBottom: 2 }}>
                <FormControl sx={{ width: 220 }}>
                  <InputLabel
                    id="building"
                    error={
                      formik.touched.buildingId &&
                      Boolean(formik.errors.buildingId)
                    }
                  >
                    Building
                  </InputLabel>
                  <Select
                    labelId="building"
                    id="building"
                    label="Building"
                    onChange={handleChange}
                    value={
                      formik.values.buildingId
                        ? formik.values.buildingId.toString()
                        : ""
                    }
                    error={
                      formik.touched.buildingId &&
                      Boolean(formik.errors.buildingId)
                    }
                    defaultValue={""}
                  >
                    {buildings &&
                      buildings.map((building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {building.name}
                        </MenuItem>
                      ))}
                  </Select>
                  {formik.touched.buildingId && formik.errors.buildingId ? (
                    <Typography
                      sx={{ fontSize: 12, marginTop: 0.3754, color: "#D32F2F" }}
                    >
                      Building is required
                    </Typography>
                  ) : null}
                </FormControl>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  // component="label"
                  // onClick={formik.submitForm}
                  type="submit"
                  sx={{ marginRight: 1 }}
                >
                  OK
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  onClick={handleCloseNewBuilding}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
      <div>
        <Dialog open={editFloor} onClose={handleCloseEditFloor}>
          <DialogTitle>Update Floor</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="name"
              label="Floor Name"
              fullWidth
              variant="standard"
            />
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                component="label"
                onClick={handleCloseEditFloor}
              >
                OK
              </Button>
              <Button
                variant="contained"
                component="label"
                onClick={handleCloseEditFloor}
              >
                Cancel
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
          {/* <Typography>error sir</Typography> */}
        </Box>
      ) : (
        <Box>
          <Box display="flex">
            <Box>
              <TextField
                id="search"
                label="Search by floorname or ID"
                variant="outlined"
                onChange={(e) => {
                  setFilterById(e.target.value);
                }}
                sx={{ width: 220 }}
              />
            </Box>
            <Box sx={{ marginLeft: 1 }}>
              <FormControl sx={{ width: 220 }}>
                <InputLabel id="demo-simple-select-label">Building</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Building"
                  onChange={(e, child) => {
                    setFilterByBuilding((child as any)?.props.value);
                  }}
                  value={
                    formik.values.buildingId
                      ? formik.values.buildingId.toString()
                      : undefined
                  }
                  defaultValue={""}
                >
                  {buildings &&
                    buildings.map((building) => (
                      <MenuItem key={building.id} value={building.id}>
                        {building.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              width="100%"
            >
              <Button variant="contained" onClick={handleOpenNewBuilding}>
                + Create
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="center">Floor Name</TableCell>
                  <TableCell align="center">Building</TableCell>
                  <TableCell align="center">Devices</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {floors
                  .filter((floor) => {
                    return (
                      floor.name
                        .toLowerCase()
                        .startsWith(filterById.toLowerCase()) ||
                      floor.id.toString().startsWith(filterById.toLowerCase())
                    );
                  })
                  .filter(
                    (floor) =>
                      floor.building.id === filterByBuilding ||
                      filterByBuilding === null
                  )
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>

                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">
                        <Button variant="outlined" sx={{ marginRight: 1 }}>
                          {row.building.name}
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        {row.devices.map((device) => (
                          <Button
                            key={device.id}
                            variant="outlined"
                            sx={{ marginRight: 1 }}
                          >
                            {device.name}
                          </Button>
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default ListFloorPage;
