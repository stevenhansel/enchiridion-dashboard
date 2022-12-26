import React, { useState, useCallback } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tab,
  Tabs,
} from '@mui/material';

import ExtendDate from '../components/ExtendDate';
import ChangeDeviceRequest from '../components/ChangeDeviceRequest';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date;
};

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const CreateRequestModal = (props: Props) => {
  const { date, setOpen, open } = props;

  const [value, setValue] = useState(0);

  const handleChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    [value]
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: '100%', height: '100%' } }}
      >
        <DialogTitle>Create Request</DialogTitle>
        <DialogContent>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Extend Date" {...a11yProps(0)} />
            <Tab label="Change Devices" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <ExtendDate setOpen={setOpen} date={date} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ChangeDeviceRequest setOpen={setOpen} />
          </TabPanel>
          <Box sx={{ marginTop: 1 }}>
            <Button variant="contained" onClick={() => setOpen(false)}>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateRequestModal;
