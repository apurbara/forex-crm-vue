import { OptionalString } from "@/resources/types/custom-types";
import Customer, { CustomerType } from "../customer";
import CustomerVerification, {
  CustomerVerificationType,
} from "../customer-verification";

export type VerificationReportType = {
  customer?: CustomerType;
  customerVerification?: CustomerVerificationType;
  CustomerVerification_id?: string;
  id?: string;
  createdTime?: string;
  note?: string;
};

export default class VerificationReport {
  constructor(
    public customer: Customer = new Customer(),
    public customerVerification: CustomerVerification = new CustomerVerification(),
    public id: string = "",
    public cratedTime: string = "",
    public note: OptionalString = undefined
  ) {}

  load(data: VerificationReportType) {
    this.id = data.id ?? this.id;
    this.cratedTime = data.createdTime ?? this.cratedTime;
    this.note = data.note;

    if (data.customer) {
      this.customer.load(data.customer);
    }

    if (data.customerVerification) {
      this.customerVerification.load(data.customerVerification);
    }
  }

  //
  isValidToSubmit() {
    return !!this.customer.id && !!this.customerVerification.id;
  }

  //
  toGraphqlVariables() {
    return {
      note: this.note,
    };
  }
}
