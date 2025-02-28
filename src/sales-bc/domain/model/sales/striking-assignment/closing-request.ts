import { ValidationResult } from "@/resources/types/custom-types";
import { isNotEmpty, isNumber } from "@/resources/composables/validator";
import { ClosingRequestType } from "@/company-bc/domain/model/manager/sales/striking-assignment/closing-request";
import StrikingAssignment from "../striking-assignment";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import { removeThousandSeparator } from "@/resources/composables/typography";

export default class ClosingRequest {
  id?: string;
  createdTime?: string;
  status?: ManagementApprovalStatus;
  transactionValue?: number;
  note?: string;
  remark?: string;
  strikingAssignment?: StrikingAssignment;

  constructor(data: ClosingRequestType = {}) {
    this.load(data);
  }
  load(data: ClosingRequestType) {
    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.status = data.status ?? this.status;
    this.transactionValue = data.transactionValue ?? this.transactionValue;
    this.note = data.note;
    if (data.strikingAssignment) {
      this.strikingAssignment ??= new StrikingAssignment();
      this.strikingAssignment.load(data.strikingAssignment);
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
        value: parseInt(
          removeThousandSeparator(this.transactionValue?.toString() ?? "")
        ),
        // value: parseInt(
        //   this.transactionValue?.toString()!.replace(/.(?=\d{3})/g, "")!
        // ),
      },
      note: this.note,
    };
  }
}
