import { Announcement } from "../types/store";

type Props = {
  announcement: Announcement;
};

const AnnouncementMedia = (props: Props) => {
  const { announcement } = props;
  if (announcement.mediaType === "image") {
    return (
      <img
        style={{ width: 395, height: 200, margin: "auto" }}
        src={announcement.media}
        alt={announcement.title}
      />
    );
  } else {
    return (
      <video
        style={{ width: 395, height: 200 }}
        src={announcement.media}
        controls
        autoPlay
        muted
      />
    );
  }
};

export default AnnouncementMedia;
