import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';

import CreateDeviceForm from '../components/CreateDeviceForm';

type Device = {
  id: number;
  machineId: string;
};

type Props = {
  children?: React.ReactNode;
};

const baseUrl = 'https://enchridion-api.stevenhansel.com/dashboard/v1';

const DevicePage = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      if (!isLoading) setIsLoading(true);

      const response = await axios.get(baseUrl + '/devices');
      const devices = response.data.contents.map((device: any) => ({
        id: device.id,
        machineId: device.machineId,
      }));

      setDevices(devices);
      setIsLoading(false);
    } catch (err) {}
  };

  const handleDeviceSave = async () => {
    await fetchDevices();
  };

  return (
    <Box>
      <CreateDeviceForm onSave={handleDeviceSave} />

      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Machine ID</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.machineId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default DevicePage;
