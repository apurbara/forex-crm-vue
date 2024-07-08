import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import { CustomerAssignmentType } from "../customer-assignment";

export type RecycleRequestType = {
  id?: string;
  createdTime?: string;
  concludedTime?: string;
  status?: ManagementApprovalStatus;
  note?: string;
  remark?: string;
  //
  CustomerAssignment_id?: string;
  customerAssignment?: CustomerAssignmentType;
};