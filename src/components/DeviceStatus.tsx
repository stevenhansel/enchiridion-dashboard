import React from 'react';
import { Box, Typography } from '@mui/material';

export enum DeviceState {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
  Unregistered = 'Unregistered',
  Loading = 'Loading',
}

const stateToColor = (state: DeviceState): string => {
  let color: string;

  switch (state) {
    case DeviceState.Connected:
      color = '#328164';
      break;
    case DeviceState.Disconnected:
      color = '#A40000';
      break;
    case DeviceState.Unregistered:
      color = '#D3C29C';
      break;
    case DeviceState.Loading:
      color = '#9FA9A3';
      break;
  }

  return color;
};

type Props = {
  state: DeviceState;
  fontSize?: number;
};

const DeviceStatus = (props: Props) => {
  const { state, fontSize } = props;

  let typographyStyle = {};
  if (fontSize !== undefined) {
    typographyStyle = {
      fontSize,
    };
  }

  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        width: 125,
      }}
    >
      <div
        style={{
          backgroundColor: stateToColor(state),
          width: 10,
          height: 10,
          borderRadius: '100%',
          marginRight: 8,
        }}
      />
      <Typography style={typographyStyle}>{state}</Typography>
    </Box>
  );
};

export default DeviceStatus;
