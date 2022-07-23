import React, { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

import axios from "../utils/axiosInstance";

import { Typography } from "@mui/material";

type Props = {
  onSave: () => Promise<void>;
};

const CreateDeviceForm = ({ onSave }: Props) => {
  const [, setIsOpen] = useState<boolean>(false);
  const [openNewDevice, setOpenNewDevice] = useState<boolean>(false);
  const [machineId, setMachineId] = useState<string>("");
  const [errorModal, setErrorModal] = useState<string>("");

  const handleClose = () => {
    setIsOpen(false);
    setMachineId("");
  };

  const handleOpenNewDevice = () => setOpenNewDevice(true);

  const handleCloseNewDevice = () => setOpenNewDevice(false);

  // const createDevice = async () => {
  //   axios
  //     .post("/v1/devices", { machineId })
  //     .then(() => onSave())
  //     .then(() => handleClose())
  //     .catch((error) => {
  //       console.log(error);
  //       setErrorModal("please enter valid value");
  //     });
  // };

  const listLantai = [
    { label: "Lantai 1" },
    { label: "Lantai 2" },
    { label: "Lantai 3" },
    { label: "Lantai 4" },
  ];

  return (
    <>
      <div>
        <Button onClick={handleOpenNewDevice}>+ Add New</Button>
        <Dialog open={openNewDevice} onClose={handleCloseNewDevice}>
          <DialogTitle>Create New Device</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Title"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Description"
              fullWidth
              variant="standard"
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={listLantai}
              sx={{ width: 300, marginTop: 2 }}
              renderInput={(params) => <TextField {...params} label="Lantai" />}
            />
            <Stack spacing={2} direction="row">
              <Box display="flex" flexDirection="column" >
                <Button
                  variant="contained"
                  component="label"
                  // onClick={createDevice}
                  sx={{ marginTop: 2 }}
                >
                  Create
                </Button>
                <Typography>{errorModal}</Typography>
              </Box>
            </Stack>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CreateDeviceForm;
