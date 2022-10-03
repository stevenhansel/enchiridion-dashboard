import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import CreateBuilding from "../components/CreateBuilding";
import UpdateBuilding from "../components/UpdateBuilding";
import DeleteBuilding from "../components/DeleteBuilding";

import { RootState } from "../store";

import usePermission from "../hooks/usePermission";

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
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const BuildingModal = (props: Props) => {

  const {open, setOpen} = props;
  const [value, setValue] = useState(0);
  const profile = useSelector((p: RootState) => p.profile);

  const hasPermissionCreateBuilding = usePermission("create_building");
  const hasPermissionUpdateBuilding = usePermission("update_building");
  const hasPermissionDeleteBuilding = usePermission("delete_building");

  const hasPermission =
    hasPermissionCreateBuilding &&
    hasPermissionUpdateBuilding &&
    hasPermissionDeleteBuilding;

  const handleChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    [value]
  );

  return (
    <>
      {hasPermission ? (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Building Menu</DialogTitle>
          <DialogContent>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {hasPermissionCreateBuilding ? (
                <Tab label="Create Building" {...a11yProps(0)} />
              ) : null}
              {hasPermissionUpdateBuilding ? (
                <Tab label="Update Building" {...a11yProps(1)} />
              ) : null}
              {hasPermissionDeleteBuilding ? (
                <Tab label="Delete Building" {...a11yProps(2)} />
              ) : null}
            </Tabs>
            {hasPermissionCreateBuilding ? (
              <TabPanel value={value} index={0}>
                <CreateBuilding setOpen={setOpen} />
              </TabPanel>
            ) : null}
            {hasPermissionUpdateBuilding ? (
              <TabPanel value={value} index={1}>
                <UpdateBuilding setOpen={setOpen} />
              </TabPanel>
            ) : null}
            {hasPermissionDeleteBuilding ? (
              <TabPanel value={value} index={2}>
                <DeleteBuilding />
              </TabPanel>
            ) : null}
            <Box sx={{ marginTop: 1 }}>
              <Button variant="contained" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <Typography>Forbidden</Typography>
        </Dialog>
      )}
    </>
  );
};

export default BuildingModal;
