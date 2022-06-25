import * as yup from 'yup';

export type CreateAnnouncementFormValues = {
  title: string;
  media: {
    file: File;
    image: HTMLImageElement;
  } | null;
  duration: number;
  notes: string;
};

export const initialValues: CreateAnnouncementFormValues = {
  title: '',
  media: null,
  duration: 0,
  notes: '',
};

export const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  media: yup.mixed().required('File is required'),
  duration: yup
    .number()
    .required()
    .min(3, 'please input at least 3 days of announcement duration'),
  notes: yup.string(),
});
