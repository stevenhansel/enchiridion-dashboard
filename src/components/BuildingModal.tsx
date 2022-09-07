import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CreateBuilding from "../components/CreateBuilding";
import UpdateBuilding from "../components/UpdateBuilding";
import DeleteBuilding from "../components/DeleteBuilding";

import { RootState } from "../store";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const BuildingModal = (props: Props) => {
  const profile = useSelector((p: RootState) => p.profile);

  const hasPermissionCreateBuilding = useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((p) => p.value);

    if (permissions.includes("create_building")) {
      return true;
    }
    return false;
  }, [profile]);

  const hasPermissionUpdateBuilding = useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((p) => p.value);

    if (permissions.includes("update_building")) {
      return true;
    }
    return false;
  }, [profile]);

  const hasPermissionDeleteBuilding = useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((p) => p.value);

    if (permissions.includes("delete_building")) {
      return true;
    }
    return false;
  }, [profile]);

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

  return (
    <>
      {hasPermission ? (
        <Dialog open={props.open} onClose={() => props.setOpen(false)}>
          <DialogTitle>Building Menu</DialogTitle>
          <DialogContent>
            {hasPermissionCreateBuilding ? (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Create Building</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <CreateBuilding setOpen={props.setOpen} />
                </AccordionDetails>
              </Accordion>
            ) : null}
            {hasPermissionUpdateBuilding ? (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Update Building</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <UpdateBuilding setOpen={props.setOpen} />
                </AccordionDetails>
              </Accordion>
            ) : null}
            {hasPermissionDeleteBuilding ? (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                >
                  <Typography>Delete Building</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <DeleteBuilding />
                </AccordionDetails>
              </Accordion>
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

export default BuildingModal;
