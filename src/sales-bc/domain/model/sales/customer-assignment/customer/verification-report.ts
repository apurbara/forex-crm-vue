import { CustomerVerificationType } from "@/company-bc/domain/model/customer-verification";
import Customer, { CustomerType } from "../customer";

export type VerificationReportType = {
  id?: string;
  createdTime?: string;
  note?: string;
  //
  Customer_id?: string;
  customer?: CustomerType;
  //
  CustomerVerification_id?: string;
  customerVerification?: CustomerVerificationType;
};

export default class VerificationReport {
  id?: string;
  createdTime?: string;
  note?: string;
  customer?: Customer;
  CustomerVerification_id?: string;
  customerVerification?: CustomerVerificationType;

  constructor(data: VerificationReportType = {}) {
    this.load(data);
  }

  load(data: VerificationReportType) {
    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.note = data.note;
    this.CustomerVerification_id =
      data.CustomerVerification_id ?? this.CustomerVerification_id;
    this.customerVerification =
      data.customerVerification ?? this.customerVerification;

    if (data.customer) {
      this.customer ??= new Customer();
      this.customer.load(data.customer);
    }
  }

  //
  isValidToSubmit() {
    return !!this.customerVerification?.id;
  }

  //
  toGraphqlVariables() {
    return {
      CustomerVerification_id: {
        type: "ID",
        required: true,
        value: this.CustomerVerification_id ?? this.customerVerification?.id,
      },
      note: this.note,
    };
  }
}
