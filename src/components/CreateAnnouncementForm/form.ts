import dayjs from "dayjs";
import * as yup from "yup";

export type CreateAnnouncementFormValues = {
  title: string;
  media: {
    file: File;
    image: HTMLImageElement;
  } | null;
  duration: number;
  startDate: Date;
  endDate: Date;
  notes: string;
  devices: string[];
  buildingId: string;
  buildingName: string;
};

export const initialValues: CreateAnnouncementFormValues = {
  title: "",
  media: null,
  duration: 0,
  notes: "",
  devices: [],
  buildingId: "",
  buildingName: "",
  startDate: dayjs().toDate(),
  endDate: dayjs().add(1, "day").toDate(),
};

export const validationSchema = yup.object({
  title: yup
    .string()
    .min(5, "Minimum character for annoucement title is 5")
    .max(30, "Maximum character for title is reached")
    .required("Title is required"),
  media: yup.mixed().required("File is required"),
  buildingId: yup.number().required("Building is required"),
  startDate: yup
    .date()
    .min(
      dayjs().subtract(1, "day").toDate(),
      "Start date of the announcement must be greater than or equal to today"
    )
    .required("Start date is required"),
  endDate: yup
    .date()
    .when("startDate", (startDate, schema) => {
      if (dayjs(startDate).isValid()) {
        const dayAfter = dayjs(startDate).add(1, "day");

        return schema.min(
          dayAfter,
          "End date must be at least 1 day after start date"
        );
      }

      return schema;
    })
    .required("End date is required"),
  notes: yup
    .string()
    .min(5, "Minimum character for annoucement title is 5")
    .max(40, "Maximum character for title is reached")
    .required("You must fill the notes"),
  devices: yup.array().min(1, "You must select atleast 1 device").required(),
});
