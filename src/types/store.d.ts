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
  description: string;
  totalAnnouncements: number;
};

// floor
export type Floor = {
  id: number;
  name: string;
  building: Building;
  devices: Device[];
};

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