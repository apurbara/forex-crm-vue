import { ValidationResult } from "@/resources/types/custom-types";
import CustomerAssignment, { CustomerAssignmentType } from "../customer-assignment";
import { isNotEmpty, isNumber } from "@/resources/composables/validator";

export type ClosingRequestType = {
  id?: string;
  createdTime?: string;
  status?: string;
  transactionValue?: number;
  note?: string;
  customerAssignment?: CustomerAssignmentType;
};
export default class ClosingRequest {
  constructor(
    public customerAssignment: CustomerAssignment = new CustomerAssignment(),
    public id: string = "",
    public createdTime: string = "",
    public status: string = "WAITING_FOR_APPROVAL",
    public transactionValue: number = 0,
    public note?: string
  ) { }

  load(data: ClosingRequestType) {
    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.status = data.status ?? this.status;
    this.transactionValue = data.transactionValue ?? this.transactionValue;
    this.note = data.note;
    if (data.customerAssignment) {
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
