import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import { StrikingAssignmentType } from "../striking-assignment";

export type ClosingRequestType = {
  id?: string;
  createdTime?: string;
  status?: ManagementApprovalStatus;
  transactionValue?: number;
  note?: string;
  remark?: string;
  //
  StrikingAssignment_id?: string;
  strikingAssignment?: StrikingAssignmentType;
};
