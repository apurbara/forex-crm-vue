import Customer, { CustomerType } from "../customer";
import CustomerVerification, { CustomerVerificationType } from "../customer-verification";

export type VerificationReportType = {
  customer?: CustomerType;
  customerVerification?: CustomerVerificationType;
  CustomerVerification_id?: string;
  id?: string;
  createdTime?: string;
  note?: string;
};

export default class VerificationReport {
  id?: string;
  cratedTime?: string;
  note?: string;
  //
  customer?: Customer;
  customerVerification?: CustomerVerification;

  constructor(
  ) { }

  load(data: VerificationReportType) {
    this.id = data.id ?? this.id;
    this.cratedTime = data.createdTime ?? this.cratedTime;
    this.note = data.note;

    if (data.customer) {
      this.customer ??= new Customer();
      this.customer.load(data.customer);
    }

    if (data.customerVerification) {
      this.customerVerification ??= new CustomerVerification();
      this.customerVerification.load(data.customerVerification);
    }
  }

  //
  isValidToSubmit() {
    return !!this.customer?.id && !!this.customerVerification?.id;
  }

  //
  toGraphqlVariables() {
    return {
      note: this.note,
    };
  }
}
