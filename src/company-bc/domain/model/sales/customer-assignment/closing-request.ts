import { ValidationResult } from "@/resources/types/custom-types";
import CustomerAssignment, { CustomerAssignmentType } from "../customer-assignment";
import { isNotEmpty, isNumber } from "@/resources/composables/validator";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";

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

export default class ClosingRequest {
  id?: string;
  createdTime?: string;
  status: ManagementApprovalStatus = ManagementApprovalStatus.WAITING_FOR_APPROVAL;
  transactionValue: number = 0;
  note?: string;
  remark?: string;
  //
  customerAssignment?: CustomerAssignment;

  constructor(data: ClosingRequestType = {}) {
    this.load(data);
  }

  load(data: ClosingRequestType) {
    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.status = data.status ?? this.status;
    this.transactionValue = data.transactionValue ?? this.transactionValue;
    this.note = data.note ?? this.note;
    this.remark = data.remark ?? this.remark
    if (data.customerAssignment) {
      this.customerAssignment ??= new CustomerAssignment();
      this.customerAssignment.load(data.customerAssignment);
    }
  }

  isValidTransactionValue(): ValidationResult {
    return (
      (isNumber(this.transactionValue) && isNotEmpty(this.transactionValue)) ||
      "transaction value is mandatory"
    );
  }

  isValidToSubmit(): boolean {
    return this.isValidTransactionValue() === true;
  }

  //
  toGraphqlVariables() {
    return {
      transactionValue: { type: "Int", value: parseInt(this.transactionValue.toString()) },
      note: this.note,
    };
  }
}
