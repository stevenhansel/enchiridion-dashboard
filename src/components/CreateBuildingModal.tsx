import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

import { useCreateBuildingMutation } from "../services/building";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name of the Building is required"),
  color: yup
    .string()
    .required("Please select the color")
});

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type CreateBuilding = {
  name: string;
}

const CreateBuildingModal = (props: Props) => {
  const { open, setOpen } = props;

  const [addNewBuilding] = useCreateBuildingMutation();

  const formik = useFormik<CreateBuilding>({
    initialValues: {
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addNewBuilding(values);
      setOpen(false);
      console.log("submitted!")
    },
  });

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create Building</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box>
            <TextField
              autoComplete="off"
              margin="dense"
              id="name"
              label="Name"
              fullWidth
              variant="standard"
              sx={{ marginBottom: 2 }}
              onChange={(e) => formik.setFieldValue("name", e.target.value)}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Box>
              <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
                OK
              </Button>
              <Button
                variant="contained"
                component="label"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBuildingModal;
