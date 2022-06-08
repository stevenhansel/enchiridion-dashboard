import React, { useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

type Props = {
  children?: React.ReactNode;
};

const UserProfilePage = (props: Props) => {
  const [age, setAge] = useState("");

  const handleChange = (event: any) => {
    setAge(event.target.value);
  };

  return (
    <Box>
      <Box display="flex" flexDirection="row" justifyContent="flex-end">
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
          <Typography variant="h5" fontWeight="bold">
            Emily
          </Typography>
        </Box>
        <Box>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Profile</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={10}>Profil</MenuItem>
              <MenuItem value={20}>Keluar</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box display="flex">
        <Box sx={{ marginTop: 8, marginLeft: 35 }}>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              ID
            </Typography>
            <Typography>Emily00</Typography>
          </Box>

          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Nama</Typography>
            <Typography>Emily</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Email</Typography>
            <Typography>Emilyhannah@gmail.com</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Status</Typography>
            <Typography>Mahasiswa</Typography>
          </Box>
        </Box>

        <Box sx={{ marginTop: 8, marginLeft: 40 }}>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              Posisi
            </Typography>
            <Typography>-</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Alasan untuk daftar</Typography>
            <Typography>ingin menginfokan UKM</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Terdaftar pada tanggal</Typography>
            <Typography>2 Juni 2022</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Data Update terakhir</Typography>
            <Typography>Version 2.0</Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="flex-end" justifyContent="flex-end">
        <Button variant="contained" sx={{ marginRight: 2 }}>
          Ganti Password
        </Button>
        <Button variant="outlined">Edit</Button>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
