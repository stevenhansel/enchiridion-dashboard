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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle align="center">Cropper</DialogTitle>

      <DialogContent sx={{ width: 600, height: 400 }}>
        <Base {...rest} />
      </DialogContent>
    </Dialog>
  );
};

export default WithModal;
