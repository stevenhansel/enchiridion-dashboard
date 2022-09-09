import { ActionButton, Color } from "../types/store";

export enum AnnouncementStatus {
  WaitingForApproval = "waiting_for_approval",
  WaitingForSync = "waiting_for_sync",
  Active = "active",
  Rejected = "rejected",
  Canceled = "canceled",
  Done = "done",
}

export enum ApprovalStatus {
  Approved = "true",
  Rejected = "false",
  All = "null",
}

export const actions: ActionButton[] = [
  {
    label: "",
    value: "all",
  },
  {
    label: "Create",
    value: "create",
  },
  {
    label: "ChangeDate",
    value: "change date",
  },
  {
    label: "Delete",
    value: "delete",
  },
  {
    label: "ChangeContent",
    value: "change content",
  },
  {
    label: "ChangeDevices",
    value: "change devices",
  },
];

export const colorBuilding: Color[] = [
  {
    id: 1,
    name: "Light Gray",
    color: "#E9E8E8",
  },
  {
    id: 2,
    name: "Gray",
    color: "#E3E2E0",
  },
  {
    id: 3,
    name: "Brown",
    color: "#EEDFDA",
  },
  {
    id: 4,
    name: "Orange",
    color: "#F9DEC9",
  },
  {
    id: 5,
    name: "Yellow",
    color: "#FDECC8",
  },
  {
    id: 6,
    name: "Green",
    color: "#DBECDA",
  },
  {
    id: 7,
    name: "Blue",
    color: "#D2E4EF",
  },
  {
    id: 8,
    name: "Purple",
    color: "#E7DEEE",
  },
  {
    id: 9,
    name: "Pink",
    color: "#F4E0E9",
  },
  {
    id: 10,
    name: "Red",
    color: "#FFE2DD",
  },
];
