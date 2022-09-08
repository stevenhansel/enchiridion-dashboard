import dayjs from 'dayjs';
import * as yup from 'yup';

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
};

const tomorrow = dayjs().add(1, 'day').toDate();

export const initialValues: CreateAnnouncementFormValues = {
  title: '',
  media: null,
  duration: 0,
  notes: '',
  devices: [],
  startDate: tomorrow,
  endDate: tomorrow,
};

export const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  media: yup.mixed().required('File is required'),
  startDate: yup
    .date()
    .min(new Date(), 'Start date cannot be in the past')
    .required('Start date is required'),
  endDate: yup.date()
    .when("startDate", (startDate, schema) => {
      if (dayjs(startDate).isValid()) {
        const dayAfter = dayjs(startDate).add(3, 'day');

        return schema.min(dayAfter, "End date must be 3 days after start date");
      }

      return schema;
    })
    .required('End date is required'),
  notes: yup.string().required("You must fill the notes"),
  devices: yup.array().min(1, 'You must select atleast 1 device').required(),
});
