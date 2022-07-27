import { StringLiteral } from "typescript";

export type BuildingFloorDevices = {
  name: string,
  floors: Floor[],
};

// @announcement
export type Status = {
  value: string;
  label: string;
};

export type Author = {
  id: number;
  name: string;
};

export type Announcement = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: Status;
  author: Author;
  media: string;
  notes: string;
  devices: Device[];
  createdAt: string;
};

export type PaginatedAnnouncements = {
  count: number;
  pages: number;
  hasNext: boolean;
  contents: Announcement[];
  title: string;
  media: string;
};

// @building
export type Building = {
  id: number;
  name: string;
  color: string;
};

// device
export type Device = {
  id: number;
  name: string;
  location: string;
  activeAnnouncements: number;
  description: string;
};

//device detail
export type DeviceDetail = {
  id: number;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  description: string;
};

// floor
export type Floor = {
  id: number;
  name: string;
  building: Building;
  devices: Device[];
};

export type UpdateFloor = {
  name: string;
  buildingId: number | null;
}

export type PaginatedFloors = {
  hasNext: boolean;
  count: number;
  pages: number;
  contents: Floor[];
};

// profile
export type Permissions = {
  id: number;
  name: string;
}

export type Role = {
  id: number;
  name: string;
  permissions: Permissions[];
}

export type UserStatus = {
  value: string;
  label: string;
}

export type AnnouncementRequest = {
  id: number;
  title: string;
}

export type AuthorRequest = {
  id: number;
  name: string;
}

export type ApprovalRequest = {
  lsc: boolean | null;
  bm: boolean | null;
}

export type ActionRequest = {
  label: string;
  value: string;
}

export type Request = {
  id: number;
  announcement: AnnouncementRequest;
  author: AuthorRequest;
  approvalStatus: ApprovalRequest;
  action: ActionRequest;
  description: string;
  createdAt: string;
}

export type Action = {
  action: string;
  status: boolean;
}