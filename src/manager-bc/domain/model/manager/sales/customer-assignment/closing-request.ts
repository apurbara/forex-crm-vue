import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import { CustomerAssignmentType } from "../customer-assignment";

export type ClosingRequestType = {
  id?: string;
  createdTime?: string;
  status?: ManagementApprovalStatus;
  transactionValue?: number;
  note?: string;
  remark?: string;
  //
  CustomerAssignment_id?: string;
  customerAssignment?: CustomerAssignmentType;
};
