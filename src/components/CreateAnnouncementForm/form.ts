import * as yup from "yup";

export type CreateAnnouncementFormValues = {
  title: string;
  //file:
  duration: number;
  notes: string;
};

export const initialValues = {
  title: "",
  //file:
  duration: 0,
  notes: "",
};

export const validationSchema = yup.object({
  title: yup.string().required("Input judulnya goblok"),
  //file:
  duration: yup
    .number()
    .required()
    .min(3, "please input at least 3 days of announcement duration"),
});
