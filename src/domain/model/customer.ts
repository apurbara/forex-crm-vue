import { ValidationResult } from "@/resources/types/custom-types";
import Area, { AreaType } from "./area-structure/area";
import { isEmail, isNotEmpty } from "@/resources/composables/validator";
import { PaginationResponseType } from "@/resources/components/abstract-pagination";
import VerificationReport, {
  VerificationReportType,
} from "./customer/verification-report";
import CustomerVerification, {
  CustomerVerificationType,
} from "./customer-verification";

export type CustomerType = {
  id?: string;
  email?: string;
  name?: string;
  area?: AreaType;
  verificationReports?: PaginationResponseType<VerificationReportType>;
};

export default class Customer {
  verificationReports: VerificationReport[] = [];
  constructor(
    public id: string = "",
    public email: string = "",
    public name: string = "",
    public area: Area = new Area()
  ) {}

  load(data: CustomerType) {
    this.id = data.id ?? this.id;
    this.email = data.email ?? this.email;
    this.name = data.name ?? this.name;
    if (data.area) {
      this.area.load(data.area);
    }
    if (data.verificationReports) {
      data.verificationReports.list.forEach((verificationReportData) => {
        const associateReport = this.verificationReports.find(
          (verificationReport) =>
            (verificationReport.customerVerification.id ==
              verificationReportData.CustomerVerification_id)
        );
        associateReport?.load(verificationReportData);
      });
    }
  }

  loadArea(areaData: AreaType) {
    this.area.load(areaData);
  }

  registerCustomerVerificationReports(list: CustomerVerificationType[]): void {
    list.forEach((element) => {
      const customerVerification = new CustomerVerification();
      customerVerification.load(element);
      this.verificationReports.push(
        new VerificationReport(this, customerVerification)
      );
    });
  }

  //
  toGraphqlVariables() {
    return {
      areaId: { type: "ID", required: true, value: this.area.id },
      name: this.name,
      email: this.email,
    };
  }

  //
  isValidName(): ValidationResult {
    return isNotEmpty(this.name) || "name is mandatory";
  }
  isValidEmail(): ValidationResult {
    return isEmail(this.email) || "email in valid format is mandatory";
  }

  isValidToRegister(): boolean {
    return (
      this.isValidEmail() === true &&
      this.isValidName() === true &&
      !!this.area.id
    );
  }
}
