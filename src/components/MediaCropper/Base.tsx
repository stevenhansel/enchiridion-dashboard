import { Box, Button, CircularProgress } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';

export type Coordinate = {
  x: number;
  y: number;
};

export type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type Props = {
  src: string;
  srcType: 'image' | 'video';
  aspect: number;
  onFinish?: (croppedAreaPixels: Area) => void;
  loading?: boolean;
};

const BaseCropper = (props: Props) => {
  const { aspect, onFinish, src, srcType, loading = false } = props;

  const [crop, setCrop] = useState<Coordinate>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const cropperSrc = useMemo(() => {
    if (srcType === 'image') {
      return {
        image: src,
      };
    } else {
      return {
        video: src,
      };
    }
  }, [src, srcType]);

  const handleCropFinish = useCallback(() => {
    if (croppedAreaPixels === null || onFinish === undefined) return;

    onFinish(croppedAreaPixels);
  }, [croppedAreaPixels]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ position: 'relative', width: '90%', height: 300 }}>
        <Cropper
          {...cropperSrc}
          aspect={aspect}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
        />
      </Box>

      <Button
        variant="contained"
        disabled={loading}
        onClick={handleCropFinish}
        sx={{ marginTop: 4, width: 100 }}
      >
        {loading ? (
          <CircularProgress size={12} sx={{ color: '#fff', marginRight: 1 }} />
        ) : null}
        Crop
      </Button>
    </Box>
  );
};

export default BaseCropper;
