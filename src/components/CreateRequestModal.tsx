import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tab,
  Tabs,
} from "@mui/material";

import ExtendDate from "../components/ExtendDate";
import ChangeDeviceRequest from "../components/ChangeDeviceRequest";
import DeleteAnnouncementRequest from "../components/DeleteAnnouncementRequest";

import { RootState } from "../store";

import usePermission from "../hooks/usePermission";

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
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const CreateRequestModal = (props: Props) => {
  const [value, setValue] = useState(0);
  const profile = useSelector((p: RootState) => p.profile);

  const hasPermissionCreateBuilding = usePermission("create_building");
  const hasPermissionUpdateBuilding = usePermission("update_building");
  const hasPermissionDeleteBuilding = usePermission("delete_building");

  const hasPermission = useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((p) => p.value);

    if (
      permissions.includes("create_building") &&
      permissions.includes("update_building") &&
      permissions.includes("delete_building")
    ) {
      return true;
    }
    return false;
  }, [profile]);

  const handleChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    [value]
  );

  return (
    <>
      {hasPermission ? (
        <Dialog
          open={props.open}
          onClose={() => props.setOpen(false)}
          PaperProps={{sx: {width: "100%", height: "100%"}}} 
        >
          <DialogTitle>Create Request</DialogTitle>
          <DialogContent>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {hasPermissionCreateBuilding ? (
                <Tab label="Extend Date" {...a11yProps(0)} />
              ) : null}
              {hasPermissionUpdateBuilding ? (
                <Tab label="Update Building" {...a11yProps(1)} />
              ) : null}
              {hasPermissionDeleteBuilding ? (
                <Tab label="Delete Request" {...a11yProps(2)} />
              ) : null}
            </Tabs>
            {hasPermissionCreateBuilding ? (
              <TabPanel value={value} index={0}>
                <ExtendDate setOpen={props.setOpen} date={props.date} />
              </TabPanel>
            ) : null}
            {hasPermissionUpdateBuilding ? (
              <TabPanel value={value} index={1}>
                <ChangeDeviceRequest setOpen={props.setOpen} />
              </TabPanel>
            ) : null}
            {hasPermissionDeleteBuilding ? (
              <TabPanel value={value} index={2}>
                <DeleteAnnouncementRequest setOpen={props.setOpen} />
              </TabPanel>
            ) : null}
            <Box sx={{ marginTop: 1 }}>
              <Button variant="contained" onClick={() => props.setOpen(false)}>
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default CreateRequestModal;
