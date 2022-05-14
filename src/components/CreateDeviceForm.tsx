import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import axios from '../axios';

type Props = {
  onSave: () => Promise<void>;
};

const CreateDeviceForm = ({ onSave }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [machineId, setMachineId] = useState<string>('');

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setMachineId('');
  };

  const createDevice = async () => {
    axios
      .post('/v1/devices', { machineId })
      .then(() => onSave())
      .then(() => handleClose());
  };

  return (
    <>
      <Button onClick={handleOpen}>Create Device</Button>

      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Create New Device</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Machine Id"
            fullWidth
            variant="standard"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={createDevice}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDeviceForm;
