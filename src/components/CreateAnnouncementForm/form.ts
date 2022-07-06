import * as yup from 'yup';

export type FormDevice = {
  deviceId: number;
  deviceName: string;
  floorName: string;
};

export type CreateAnnouncementFormValues = {
  title: string;
  media: {
    file: File;
    image: HTMLImageElement;
  } | null;
  duration: number;
  notes: string;
  devices: FormDevice[];
};

export const initialValues: CreateAnnouncementFormValues = {
  title: '',
  media: null,
  duration: 0,
  notes: '',
  devices: [],
};

export const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  media: yup.mixed().required('File is required'),
  duration: yup
    .number()
    .required()
    .min(3, 'Please input at least 3 days of announcement duration'),
  notes: yup.string(),
  devices: yup.array().min(1, 'You must select atleast 1 device').required(),
});
