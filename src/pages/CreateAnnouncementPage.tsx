import React from "react";

import Box from "@mui/material/Box";

import CreateAnnouncementForm from "../components/CreateAnnouncementForm";
import Layout from "../components/Layout";

type Props = {
  children?: React.ReactNode;
};

const CreateAnnouncementPage = (props: Props) => {
  return (
    <Box display="flex" flexDirection="column">
      <CreateAnnouncementForm />
    </Box>
  );
};

export default CreateAnnouncementPage;
