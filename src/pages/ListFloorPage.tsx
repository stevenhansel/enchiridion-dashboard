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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";

import ListFloorForm from "../components/ListFloorForm";
import { floorApi } from "../services/floor";
import { AppDispatch, RootState } from "../store";

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
  buildings: Building[];
  devices: Device[];
};

type FloorPage = {
  hasNext: boolean;
  count: number;
  pages: number;
  contents: Floor[];
};

type Campuses = {
  value: string;
  campusName: string;
};

type CreateFloor = {
  name: string;
  buildingId: number | null;
};

type Props = {
  children?: React.ReactNode;
};

const campusesMock: Campuses[] = [
  {
    value: "syahdan",
    campusName: "Syahdan",
  },
  {
    value: "alam sutera",
    campusName: "Alam Sutera",
  },
  {
    value: "anggrek",
    campusName: "Anggrek",
  },
  {
    value: "bandung",
    campusName: "Bandung",
  },
  {
    value: "malang",
    campusName: "Malang",
  },
  {
    value: "medan",
    campusName: "Medan",
  },
  {
    value: "all campuses",
    campusName: "All Campuses",
  },
];

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name is required"),
  buildingId: yup
    .number()
    .required("Building is required"),
});

const ListFloorPage = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [error, setError] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpenNewFloor = () => setOpen(true);
  const handleCloseNewFloor = () => setOpen(false);

  const [editFloor, setIsEditFloor] = useState(false);
  const handleOpenEditFloor = () => setIsEditFloor(true);
  const handleCloseEditFloor = () => setIsEditFloor(false);

  const [foundUsers, setFoundUsers] = useState(floors);

  const [selectedCampus, setIsSelectedCampus] = useState("");

  const dispatch: AppDispatch = useDispatch();

  const handleListFloor = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    const response = await dispatch(floorApi.endpoints.getFloors.initiate(""));

    const getData: Floor[] = response.data.contents.map((data: any) => ({
      id: data.id,
      name: data.name,
      buildings: data.buildings,
      devices: data.devices,
    }));
    setFloors(getData);
  }, []);

  const handleCreateFloor = useCallback(
    async (values: CreateFloor): Promise<void> => {
      await dispatch(
        floorApi.endpoints.createFloor.initiate({
          name: values.name,
          buildingId: values.buildingId,
        })
      );
    },
    []
  );

  const formik = useFormik<CreateFloor>({
    initialValues: {
      name: "",
      buildingId: null,
    },
    validationSchema: validationSchema,
    onSubmit: handleCreateFloor,
  });

  useEffect(() => {
    handleListFloor();
    console.log(floors);
  }, []);

  //   const filterUsers = (e: any) => {
  //     const keyword = e.target.value;

  //     if (keyword !== "") {
  //       const result = floors.filter((floor) => {
  //         return (
  //           floor.floorName.toLowerCase().startsWith(keyword.toLowerCase()) ||
  //           floor.id.toString().startsWith(keyword.toLowerCase())
  //         );
  //       });
  //       setFoundUsers(result);
  //     } else {
  //       setFoundUsers(floors);
  //     }
  //   };

  //   const filterBuilding = (selectByUser: any): any => {
  //     const filtered = floors.filter(
  //       (floor) => floor.buildingName === selectByUser
  //     );
  //     return filtered;
  //   };

  //   const handleFilterBuilding = (e: any) => {
  //     const selected = e.target.value;

  //     if (selected !== "All Campuses") {
  //       setFoundUsers(filterBuilding(selected));
  //     } else {
  //       setFoundUsers(floors);
  //     }
  //     setIsSelectedCampus(selected);
  //   };

  return (
    <Box>
      <ListFloorForm />
      <form onSubmit={formik.handleSubmit}>
        <Dialog open={open} onClose={handleCloseNewFloor}>
          <DialogTitle>Create Floor</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="name"
              label="Name"
              fullWidth
              variant="standard"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              id="building"
              label="Building"
              fullWidth
              variant="standard"
              sx={{ marginBottom: 2 }}
            />
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                component="label"
              >
                OK
              </Button>
              <Button
                variant="contained"
                component="label"
                onClick={handleCloseNewFloor}
              >
                Cancel
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </form>
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
      {!isLoading ? (
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
                // onChange={filterUsers}
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
                  //   onChange={handleFilterBuilding}
                  value={selectedCampus}
                >
                  {campusesMock.map((campus) => (
                    <MenuItem key={campus.value} value={campus.campusName}>
                      {campus.campusName}
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
              <Button variant="contained" onClick={handleOpenNewFloor}>
                + Create
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="justify">Floor Name</TableCell>
                  <TableCell align="justify">Building</TableCell>
                  <TableCell align="justify">Devices</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {floors.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="justify">{row.name}</TableCell>
                    {row.buildings.map((building) => (
                      <TableRow
                        key={building.id}
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <Button variant="outlined" sx={{ marginRight: 1 }}>
                          {building.name}
                        </Button>
                      </TableRow>
                    ))}
                    <TableCell
                      align="justify"
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      {row.devices.map((device) => (
                        <TableRow
                          key={device.id}
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Button variant="outlined" sx={{ marginRight: 1 }}>
                            {device.name}
                          </Button>
                        </TableRow>
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
                          <EditIcon onClick={handleOpenEditFloor} />
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
