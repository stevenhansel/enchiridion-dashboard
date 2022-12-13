import React, { useState } from "react";
import { Box, Typography, Checkbox } from "@mui/material";

type PermissionList = {
  id: number;
  name: string;
  permissions: string[];
};

const mockPermissions: PermissionList[] = [
  {
    id: 1,
    name: "Announcement",
    permissions: [
      "Search Announcements",
      "Create Announcement",
      "See All Annoucements",
      "Update Announcement Duration",
      "Delete Announcement",
      "Approve/Reject Announcement",
      "Approve/Reject Announcement Duration Update",
      "Approve/Reject Announcement Deletion",
    ],
  },
  {
    id: 2,
    name: "Floors",
    permissions: [
      "List Floors",
      "See Floor Detail",
      "Create Floor",
      "Update Floor",
      "Delete Floor",
    ],
  },
  {
    id: 3,
    name: "Device",
    permissions: [
      "List Devices",
      "See Device Detail",
      "Create Devices",
      "Update Devices",
      "Delete Devices",
    ],
  },
  {
    id: 4,
    name: "Users",
    permissions: [
      "Approve/Reject User",
      "List Users",
      "See User Detail",
      "Update User Permission",
    ],
  },
];

const ListPermission = () => {
  const [lists] = useState<PermissionList[]>(mockPermissions);

  return (
    <Box display="flex" flexDirection="column">
      {lists.map((list) => (
        <Box key={list.id}>
          <>
            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
              {list.name}
            </Typography>
            {list.permissions.map((permission, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <Checkbox />
                <Typography>{permission}</Typography>
              </Box>
            ))}
          </>
        </Box>
      ))}
    </Box>
  );
};

export default ListPermission;
