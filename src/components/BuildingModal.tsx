import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CreateBuilding from '../components/CreateBuilding';
import UpdateBuilding from '../components/UpdateBuilding';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const BuildingModal = (props: Props) => {
  return (
    <>
      <Dialog open={props.open} onClose={() => props.setOpen(false)}>
        <DialogTitle>Building Menu</DialogTitle>
        <DialogContent>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Create Building</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CreateBuilding setOpen={props.setOpen}/>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Update Building</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <UpdateBuilding setOpen={props.setOpen}/>
            </AccordionDetails>
          </Accordion>
          <Box>
            <Button variant="contained" onClick={() => props.setOpen(false)}>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BuildingModal;
