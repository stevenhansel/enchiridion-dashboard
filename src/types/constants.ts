import { ActionButton} from "../types/store";

export enum AnnouncementStatus {
  WaitingForApproval = "WaitingForApproval",
  Active = "Active",
  Rejected = "Rejected",
  Canceled = "Canceled",
  Done = "Done",
}

export enum ApprovalStatus {
  Approved = 'true',
  Rejected = 'false',
  All = 'null',
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
