import { type FormikContextType } from 'formik';
import { CreateAnnouncementFormValues } from './form';

export const validateFormikFields = (
  formik: FormikContextType<CreateAnnouncementFormValues>,
  fields: string[]
): string[] => {
  const { validateField, errors, setFieldTouched } = formik;

  fields.forEach(field => validateField(field));
  /**
   * for (const field of fields) {
   *    validateField(field)
   * }
   */

  // "errors": {
  //   "title": "title ga boleh kosong",
  //   "duration": "duration mesti lebih dari 3 hari",
  // }

  // Object.keys() ["title", "duration"]
  // Object.values() ["title ga boleh kosong", "duration mesti lebih dari 3 hari"]
  // Object.entries() [["title", "title ga boleh kosong"], ["duration", "duration mesti lebih dari 3 hari"]]

  // .filter()
  const fieldErrors = Object.keys(errors).filter(key => fields.includes(key));

  if (fieldErrors.length > 0) {
    // ["title", "duration"]
    fieldErrors.forEach(field => setFieldTouched(field));
  }

  return fieldErrors;
};
