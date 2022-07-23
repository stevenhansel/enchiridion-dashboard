import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

type Props = {
  children?: React.ReactNode;
};

const DeviceDetailPage = (props: Props) => {
  const { id } = useParams();

  const [openNewDevice, setOpenNewDevice] = useState(false);
  const [openDeleteDevice, setDeleteDevice] = useState(false);

  const handleOpenNewDevice = () => setOpenNewDevice(true);
  const handleCloseNewDevice = () => setOpenNewDevice(false);

  const handleOpenDeleteDevice = () => setDeleteDevice(true);
  const handleCloseDeleteDevice = () => setDeleteDevice(false);

  const listLantai = [
    { label: "Lantai 1" },
    { label: "Lantai 2" },
    { label: "Lantai 3" },
    { label: "Lantai 4" },
  ];

  const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
    },
  ];

  return (
    <Box>
      <Typography align="center" variant="h5" fontWeight="bold">
        Device {id}
      </Typography>
      <Box display="flex">
        <Box sx={{ marginTop: 8, marginLeft: 45 }}>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              ID Device
            </Typography>
            <Typography>HJK-{id}</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Nama Device</Typography>
            <Typography>Depan BCA</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Deskripsi Device</Typography>
            <Typography>test 123</Typography>
          </Box>
        </Box>

        <Box sx={{ marginTop: 8, marginLeft: 40 }}>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              Floor
            </Typography>
            <Typography>Lantai 1</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Created at</Typography>
            <Typography>28 Mei 2022</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Updated at</Typography>
            <Typography>2 Juni 2022</Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Button
          variant="contained"
          sx={{ marginRight: 2 }}
          onClick={handleOpenNewDevice}
        >
          Update
        </Button>
        <Button variant="outlined" onClick={handleOpenDeleteDevice}>
          Delete
        </Button>
      </Box>
      <Dialog open={openNewDevice} onClose={handleCloseNewDevice}>
        <DialogTitle display="flex" alignItems="center" justifyContent="center">
          Update Device
        </DialogTitle>
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
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="contained"
                component="label"
                onClick={handleCloseNewDevice}
                sx={{ marginTop: 2 }}
              >
                Update
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={openDeleteDevice} onClose={handleCloseDeleteDevice}>
        <DialogTitle>Delete Page?</DialogTitle>
        <DialogContent>
          Apakah anda yakin ingin menghapus device ini?
        </DialogContent>
        <Box
          sx={{ marginLeft: 2, marginBottom: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            sx={{ marginRight: 2 }}
            onClick={handleCloseDeleteDevice}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCloseDeleteDevice}>
            Yes
          </Button>
        </Box>
      </Dialog>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Announcement
        </Typography>
      </Box>
      <Box>
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164} variant="standard">
          {itemData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
};

export default DeviceDetailPage;
