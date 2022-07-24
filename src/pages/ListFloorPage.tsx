import React, { useCallback, useState } from "react";

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
  TextField,
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
import DeleteIcon from "@mui/icons-material/Delete";

import ListFloorForm from "../components/ListFloorForm";
import EditFloorModal from "../components/EditFloorModal";
import CreateFloorModal from '../components/CreateFloorModal';

import { useGetBuildingsQuery } from "../services/building";
import { useGetFloorsQuery } from "../services/floor";

const ListFloorPage = () => {
  const {
    data: buildingHash,
    isLoading: isGetBuildingsLoading,
    error: getBuildingsError,
    refetch: refetchGetBuildings,
  } = useGetBuildingsQuery(null);
  const {
    data: floorHash,
    isLoading: isGetFloorsLoading,
    error: getFloorsError,
    refetch: refetchGetFloors,
  } = useGetFloorsQuery(null);

  const [filterById, setFilterById] = useState("");
  const [filterByBuilding, setFilterByBuilding] = useState<string | null>(null);

  const [openCreateFloor, setOpenCreateFloor] = useState(false);
  const [openEditFloor, setOpenEditFloor] = useState(false);

  const isLoading = isGetBuildingsLoading && isGetFloorsLoading;
  const error = getBuildingsError || getFloorsError;

  const refetch = useCallback(async () => { await Promise.all([refetchGetBuildings, refetchGetFloors]); }, [refetchGetBuildings, refetchGetFloors]);

  const filteredFloors = floorHash ? Object.values(floorHash)
    .filter((floor) => (
      floor.name.toLowerCase().startsWith(filterById.toLowerCase()) ||
      floor.id.toString().startsWith(filterById.toLowerCase()) ||
      filterByBuilding === floor.building.id.toString() ||
      filterByBuilding === null
    )) : [];

  return (
    <Box>
      <ListFloorForm />
      <EditFloorModal 
        buildingHash={buildingHash}
        open={openEditFloor} 
        setOpen={setOpenEditFloor}
        refetch={refetch} 
      />
      <CreateFloorModal       
        buildingHash={buildingHash}
        open={openCreateFloor} 
        setOpen={setOpenCreateFloor} 
        refetch={refetch} 
      />
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
                    if ((child as any)?.props.value === 'all-building') {
                      setFilterByBuilding(null);
                    } else {
                      setFilterByBuilding((child as any)?.props.value);
                    }
                  }}
                  defaultValue={""}
                >
                  <MenuItem value="all-building">
                    All Campus 
                  </MenuItem>
                  {buildingHash && Object.entries(buildingHash).map(([buildingId, building]) => (
                    <MenuItem key={buildingId} value={buildingId}>
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
              <Button variant="contained" onClick={() => setOpenCreateFloor(true)}>
                + Create
              </Button>
            </Box>
          </Box>
          {filteredFloors && filteredFloors.length > 0 ? 
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
                {filteredFloors.map((row) => (
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
          </TableContainer> : <Typography>Not Found!</Typography> }
        </Box>
      )}
    </Box>
  );
};

export default ListFloorPage;
