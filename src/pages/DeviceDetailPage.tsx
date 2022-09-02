import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useGetDeviceDetailQuery } from "../services/device";
import Layout from "../components/Layout";

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

const DeviceDetailPage = () => {
  const { deviceId = "" } = useParams();

  const { data: deviceDetailHash } = useGetDeviceDetailQuery(
    { deviceId },
    {
      skip: deviceId === "",
    }
  );

  return (
    <Layout>
      <Typography align="center" variant="h5" fontWeight="bold">
        {deviceDetailHash?.name}
      </Typography>
      <Box display="flex" justifyContent="center">
        <Box sx={{ marginTop: 8 }}>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              ID
            </Typography>
            <Typography>{deviceId}</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Location</Typography>
            <Typography>{deviceDetailHash?.location}</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Deskripsi</Typography>
            <Typography>{deviceDetailHash?.description}</Typography>
          </Box>
        </Box>

        <Box sx={{ marginTop: 8, marginLeft: 40 }}>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Created at</Typography>
            <Typography>{toDate(deviceDetailHash?.createdAt)}</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Updated at</Typography>
            <Typography>{toDate(deviceDetailHash?.updatedAt)}</Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Announcement
        </Typography>
      </Box>
      <Box>
        {/* {announcementHash && Object.entries(announcementHash).map(([announcementId, announcement]) => (
                      ))} */}
      </Box>
    </Layout>
  );
};

export default DeviceDetailPage;
