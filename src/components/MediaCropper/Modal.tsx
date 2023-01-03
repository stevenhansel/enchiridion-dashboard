import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import Base from './Base';
import type { Props as BaseCropperProps } from './Base';

export type WithModalProps = {
  open?: boolean;
  onClose?: () => void;
};

export type Props = WithModalProps & BaseCropperProps;

const WithModal = (props: Props) => {
  const { open = false, onClose, ...rest } = props;

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (rest.loading === true) return;
        else if (onClose !== undefined) onClose();
      }}
    >
      <DialogTitle align="center">Cropper</DialogTitle>

      <DialogContent sx={{ width: 600, height: 450 }}>
        <Base {...rest} />
      </DialogContent>
    </Dialog>
  );
};

export default WithModal;
