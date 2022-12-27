import Base from './Base';
import WithModal from './Modal';
import type { Props as BaseCropperProps } from './Base';
import type { WithModalProps } from './Modal';

type Props = {
  withModal?: boolean;
} & WithModalProps &
  BaseCropperProps;

const MediaCropper = (props: Props) => {
  const {
    aspect,
    src,
    srcType,
    open,
    onClose,
    onFinish,
    loading,
    withModal = false,
  } = props;

  const baseCropperProps = {
    src,
    srcType,
    aspect,
    onFinish,
    loading,
  };

  const withModalProps = {
    ...baseCropperProps,
    open,
    onClose,
  };

  if (withModal) {
    return <WithModal {...withModalProps} />;
  }

  return <Base {...baseCropperProps} />;
};

export default MediaCropper;
