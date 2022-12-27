import React, { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import mpegts from 'mpegts.js';
import { useGetDeviceDetailQuery } from '../services/device';
import config from '../config';

type Props = {
  deviceId: string;
};

const LivestreamCam = (props: Props) => {
  const { deviceId } = props;

  const [refreshLivestream, setRefreshLivestream] = useState(false);

  const { data: devices } = useGetDeviceDetailQuery(
    { deviceId },
    {
      skip: deviceId === '',
    }
  );

  useEffect(() => {
    if (
      devices &&
      devices.cameraEnabled &&
      mpegts.getFeatureList().mseLivePlayback
    ) {
      const videoElement = document.getElementById('device-stream');
      if (videoElement === null) {
        return;
      }

      const player = mpegts.createPlayer(
        {
          type: 'flv',
          url: `${config.srsBaseUrl}/live/livestream/${deviceId}.flv`,
          hasAudio: false,
          hasVideo: true,
          isLive: true,
        },
        {
          enableWorker: true,
          liveBufferLatencyChasing: true,
          liveBufferLatencyMaxLatency: 10,
        }
      );

      player.attachMediaElement(videoElement as HTMLMediaElement);
      player.load();
      player.play();
    }
  }, [devices, deviceId, refreshLivestream]);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setRefreshLivestream(!refreshLivestream)}
      >
        refresh
      </Button>
      <Box>
        <video
          autoPlay
          muted
          style={{ width: 600, height: 450 }}
          id="device-stream"
        />
      </Box>
    </>
  );
};

export default LivestreamCam;
