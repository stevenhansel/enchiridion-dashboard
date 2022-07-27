import React from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import { useGetDeviceDetailQuery, useGetDevicesQuery } from "../services/device";

type Props = {
  children?: React.ReactNode;
};

const toDate = (dateStr: string | undefined) => dayjs(dateStr).format("DD MMM YYYY h:mm A");

const DeviceDetailPage = (props: Props) => {
  const { deviceId = "" } = useParams();
  
  const {
    data: deviceHash,
    isLoading: isGetDeviceLoading,
    error: isGetDeviceError,
  } = useGetDevicesQuery(null);

  const { data: deviceDetailHash, isLoading: isGetDeviceDetailLoading } =
  useGetDeviceDetailQuery(
    { deviceId },
    {
      skip: deviceId === "",
    }
  );

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

  // const getDeviceDetail = useCallback( async (): Promise<void> => {
  //   const response = await dispatch(deviceApi.endpoints.getDeviceDetail.initiate(""))

  //   console.log(response);
  // }, [])

  return (
    <Box>
      <Typography align="center" variant="h5" fontWeight="bold">
        Device {deviceId}
      </Typography>
      <Box display="flex" justifyContent="center">
        <Box sx={{ marginTop: 8 }}>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              ID
            </Typography>
            <Typography>HJK-{deviceId}</Typography>
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
