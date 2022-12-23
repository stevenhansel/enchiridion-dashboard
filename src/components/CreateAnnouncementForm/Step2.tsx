import React, { useState, useCallback, useContext, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import {
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
} from "@mui/icons-material";
import { useFormikContext } from "formik";

import { useGetBuildingsQuery } from "../../services/building";

import { CreateAnnouncementFormContext } from "./context";
import { CreateAnnouncementFormValues } from "./form";
import { validateFormikFields } from "./util";

const fields = ["buildingId"];

const Step2 = () => {
  const formik = useFormikContext<CreateAnnouncementFormValues>();
  const { errors, touched, validateField, setFieldValue, values } = formik;
  const [selectedBuildingName, setSelectedBuildingName] = useState(
    values.buildingName
  );
  const { handleNextStep, handlePrevStep } = useContext(
    CreateAnnouncementFormContext
  );

  const { data: buildings } = useGetBuildingsQuery(null);

  const handleNextSubmission = useCallback(() => {
    const errors = validateFormikFields(formik, fields);
    if (errors.length > 0) return;

    handleNextStep();
  }, [formik, handleNextStep]);

  const handlePrevSubmission = useCallback(() => {
    handlePrevStep();
  }, [handlePrevStep]);

  const handleSelectedBuilding = useCallback(
    (selectedBuildingId: string, selectedBuildingName: string) => {
      const selectedBuildingCheck =
        values.buildingId.indexOf(selectedBuildingId);
      if (selectedBuildingCheck !== -1) {
        setFieldValue("buildingId", "");
      } else {
        setFieldValue("buildingId", selectedBuildingId);
      }
      setSelectedBuildingName(selectedBuildingName);
    },
    [values, setFieldValue]
  );

  useEffect(() => {
    fields.forEach((field) => validateField(field));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFieldValue("buildingName", selectedBuildingName);
  }, [selectedBuildingName]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        sx={{
          border: "1px solid #c4c4c4",
        }}
      >
        <Box sx={{ width: 200 }}>
          <Box display="flex" justifyContent="center">
            <Typography variant="h6">Available Building:</Typography>
          </Box>
          {buildings &&
            buildings.map((building) => (
              <Box key={building.id} display="flex" justifyContent="flex-start">
                <IconButton
                  onClick={() => {
                    handleSelectedBuilding(
                      building.id.toString(),
                      building.name
                    );
                  }}
                >
                  {values.buildingId === building.id.toString() ? (
                    <RadioButtonCheckedIcon color="secondary" />
                  ) : (
                    <RadioButtonUncheckedIcon color="secondary" />
                  )}
                </IconButton>
                <Box display="flex" alignItems="center">
                  <Typography fontWeight="bold">{building.name}</Typography>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
      {touched.buildingId &&
      errors.buildingId &&
      typeof errors.buildingId === "string" ? (
        <Box display="flex" justifyContent="center">
          <Typography
            sx={{
              fontSize: "12px",
              color: "#D32F2F",
              marginTop: 1,
            }}
          >
            {errors.buildingId}
          </Typography>
        </Box>
      ) : null}
      <Box display="flex" justifyContent="center" sx={{ marginTop: 3 }}>
        <Button
          onClick={handlePrevSubmission}
          variant="contained"
          sx={{ marginRight: 1 }}
        >
          Previous
        </Button>
        <Button onClick={handleNextSubmission} variant="contained">
          Next
        </Button>
      </Box>
    </>
  );
};

export default Step2;
