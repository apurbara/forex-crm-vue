import { ValidationResult } from "@/resources/types/custom-types";
import { isNotEmpty, isNumber } from "@/resources/composables/validator";
import CustomerAssignment, {
  CustomerAssignmentType,
} from "../customer-assignment";

export type ClosingRequestType = {
  id?: string;
  createdTime?: string;
  status?: string;
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
  status?: string;
  transactionValue?: number;
  note?: string;
  remark?: string;
  customerAssignment?: CustomerAssignment;

  constructor(data: ClosingRequestType = {}) {
    this.load(data);
  }
  load(data: ClosingRequestType) {
    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.status = data.status ?? this.status;
    this.transactionValue = data.transactionValue ?? this.transactionValue;
    this.note = data.note;
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
      transactionValue: {
        type: "Int",
        value: parseInt(this.transactionValue?.toString()!),
      },
      note: this.note,
    };
  }
}
