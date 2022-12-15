import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import dayjs from "dayjs";
import Cropper, { Area } from "react-easy-crop";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { Box, Button, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { CreateAnnouncementFormContext } from "./context";
import { CreateAnnouncementFormValues } from "./form";
import { validateFormikFields } from "./util";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const fields = ["title", "media", "startDate", "endDate", "notes"];

export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file !== null) {
        resolve(URL.createObjectURL(file));
      } else {
        reject("File is null");
      }
    }, "image/jpeg");
  });
}

enum MediaUploadState {
  Upload,
  Cropping,
  Cropped,
}

const Step1 = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [mediaUploadState, setMediaUploadState] = useState<MediaUploadState>(
    MediaUploadState.Upload
  );

  const formik = useFormikContext<CreateAnnouncementFormValues>();
  const { values, errors, touched, setFieldValue } = formik;

  const { handleNextStep } = useContext(CreateAnnouncementFormContext);

  // const handleCrop = useCallback(async () => {
  //   try {
  //     const croppedImage = await getCroppedImg(
  //       imageSrc,
  //       croppedAreaPixels,
  //       rotation
  //     );

  //     setCroppedImage(croppedImage);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, []);

  const renderMediaCropper = useCallback(() => {
    if (values.media === null) return;

    const cropperProps: {
      image?: string;
      video?: string;
    } = {};
    if (values.media.type === "image" && values.media.image !== null) {
      cropperProps.image = values.media.image.src;
    } else if (values.media.type === "video" && values.media.video !== null) {
      cropperProps.video = values.media.video.src;
    } else {
    }

    return (
      <Cropper
        {...cropperProps}
        crop={crop}
        rotation={rotation}
        zoom={zoom}
        aspect={16 / 7}
        onCropChange={setCrop}
        onRotationChange={setRotation}
        onZoomChange={setZoom}
        onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
      />
    );
  }, [values.media, crop, rotation, zoom]);

  const renderMediaPreview = useCallback(() => {
    if (values.media === null) return;

    const width = 498;

    if (values.media.type === "image" && values.media.image !== null) {
      return (
        <img
          style={{ width }}
          src={values.media.image.src}
          alt="Media preview"
        />
      );
    } else if (values.media.type === "video" && values.media.video !== null) {
      return (
        <video
          style={{ width }}
          src={values.media.video.src}
          controls
          autoPlay
          muted
        />
      );
    }
  }, [values.media]);

  const renderMedia = useCallback(() => {
    if (mediaUploadState === MediaUploadState.Cropping)
      return renderMediaCropper();
    else if (mediaUploadState === MediaUploadState.Cropped)
      return renderMediaPreview();

    return null;
  }, [mediaUploadState, renderMediaCropper, renderMediaPreview]);

  const handleUploadMedia = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const files = event.currentTarget.files;
        if (files === null) {
          throw new Error("Something went wrong when reading the image");
        }
        const file = files.item(0);
        if (file === null) {
          throw new Error("Something went wrong when reading the image");
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          if (file.type === "video/mp4") {
            if (!e.target || (e.target && !e.target.result))
              throw new Error("Something went wrong when reading the video");

            const video = document.createElement("video");

            video.onloadedmetadata = () => {
              setMediaUploadState(MediaUploadState.Cropping);
              setFieldValue("media", {
                file,
                image: null,
                video,
                duration: video.duration * 1000,
                type: "video",
              });
            };

            video.onerror = () => {
              throw new Error("Something went wrong when reading the video");
            };

            video.src = e.target?.result as string;
          } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
            if (!e.target || (e.target && !e.target.result))
              throw new Error("Something went wrong when reading the image");

            const image = new Image();

            image.onload = () => {
              setMediaUploadState(MediaUploadState.Cropping);
              setFieldValue("media", {
                file,
                image,
                video: null,
                duration: null,
                type: "image",
              });
            };

            image.onerror = () => {
              throw new Error("Something went wrong when reading the image");
            };

            image.src = e.target?.result as string;
          }

          reader.onerror = () => {
            throw new Error("Something went wrong when reading the file");
          };
        };

        reader.readAsDataURL(file);
      } catch (e) {
        if (e instanceof Error) {
        }
      }
    },
    [setFieldValue]
  );
  const handleNextSubmission = useCallback(() => {
    const errors = validateFormikFields(formik, fields);
    if (errors.length > 0) return;
    if (mediaUploadState !== MediaUploadState.Cropped) return;

    handleNextStep();
  }, [formik, handleNextStep, mediaUploadState]);

  useEffect(() => {
    // TODO: Handle crop
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{ width: "100%" }}
    >
      <Box sx={{ marginBottom: 2, width: 500 }}>
        <Typography>Title</Typography>
        <TextField
          fullWidth
          id="title"
          name="title"
          variant="outlined"
          value={values.title}
          onChange={(e) => setFieldValue("title", e.target.value)}
          error={touched.title && Boolean(errors.title)}
        />
        {touched.title && errors.title ? (
          <Typography variant="caption" color={red[700]} fontSize="">
            {errors.title}
          </Typography>
        ) : null}
      </Box>
      <Box sx={{ marginBottom: 3, width: 500 }}>
        <Typography sx={{ marginBottom: 1 }}>Media File</Typography>

        <Box
          sx={{
            position: "relative",
            border: "1px solid gray",
            boxSizing: "border-box",
            background: "lightgray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 500,
            height: 300,
            marginBottom: 1,
          }}
        >
          {renderMedia()}
        </Box>

        {values.media !== null ? (
          <Typography
            sx={{ marginBottom: 1, textAlign: "center" }}
            variant="body1"
          >
            {values.media.file.name}
          </Typography>
        ) : null}

        <Button
          variant="contained"
          component="label"
          color={touched.media && errors.media ? "error" : "primary"}
        >
          Upload
          <input
            type="file"
            hidden
            accept=".jpg,.jpeg,.mp4"
            onChange={(e) => handleUploadMedia(e)}
          />
        </Button>

        <Button variant="contained">Crop</Button>

        {touched.media && errors.media ? (
          <Typography
            variant="caption"
            color={red[700]}
            fontSize=""
            sx={{ marginLeft: 1 }}
          >
            {errors.media}
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ marginBottom: 2, width: 500 }}>
        <DesktopDatePicker
          label="Start Date Announcement"
          inputFormat="MM/dd/yyyy"
          value={values.startDate}
          onChange={(newStartDate) => {
            let newEndDate = values.endDate;
            if (newStartDate && dayjs(newStartDate).isSameOrAfter(newEndDate)) {
              newEndDate = dayjs(newStartDate).add(1, "day").toDate();
            }

            setFieldValue("startDate", newStartDate);
            setFieldValue("endDate", newEndDate);
          }}
          renderInput={(params) => <TextField {...params} />}
          shouldDisableDate={(date) =>
            dayjs(date).isBefore(dayjs().subtract(1, "day"))
          }
        />
      </Box>

      {touched.startDate && errors.startDate ? (
        <Typography variant="caption" color={red[700]} fontSize="">
          {String(errors.startDate)}
        </Typography>
      ) : null}

      <Box sx={{ marginBottom: 2, width: 500 }}>
        <DesktopDatePicker
          label="End Date Announcement"
          inputFormat="MM/dd/yyyy"
          value={values.endDate}
          onChange={(newDate) => setFieldValue("endDate", newDate)}
          renderInput={(params) => <TextField {...params} />}
          shouldDisableDate={(date) =>
            dayjs(date).isSameOrBefore(values.startDate || dayjs())
          }
        />
      </Box>

      {touched.endDate && errors.endDate ? (
        <Typography variant="caption" color={red[700]} fontSize="">
          {String(errors.endDate)}
        </Typography>
      ) : null}

      <Box sx={{ marginBottom: 2, width: 500 }}>
        <Typography>Additional Notes</Typography>
        <TextField
          fullWidth
          autoComplete="off"
          id="notes"
          name="notes"
          variant="outlined"
          value={values.notes}
          onChange={(e) => setFieldValue("notes", e.target.value)}
          error={touched.notes && Boolean(errors.notes)}
        />
        {touched.notes && errors.notes ? (
          <Typography variant="caption" color={red[700]} fontSize="">
            {errors.notes}
          </Typography>
        ) : null}
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Button variant="contained" onClick={handleNextSubmission}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step1;
