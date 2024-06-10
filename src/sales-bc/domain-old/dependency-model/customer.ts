import { AreaType } from "@/company-bc/domain/model/area-structure/area";
import { PaginationResponseType } from "@/resources/components/abstract-pagination";
import VerificationReport, { VerificationReportType } from "./customer/verification-report";
import CustomerVerification, { CustomerVerificationType } from "./customer-verification";
import { ValidationResult } from "@/resources/types/custom-types";
import { isEmail, isNotEmpty, isPhone } from "@/resources/composables/validator";

export type CustomerType = {
  id?: string;
  createdTime?: string;
  email?: string;
  name?: string;
  phone?: string;
  source?: string;
  verificationScore?: number;
  area?: AreaType;
  verificationReports?: PaginationResponseType<VerificationReportType>;
};

export default class Customer {
  verificationReports: VerificationReport[] = [];
  constructor(
    public id: string = "",
    public email: string = "",
    public name: string = "",
    public phone: string = "",
    public source: string = "",
    public area?: AreaType
  ) { }

  load(data: CustomerType) {
    this.id = data.id ?? this.id;
    this.email = data.email ?? this.email;
    this.name = data.name ?? this.name;
    this.phone = data.phone ?? this.phone;
    this.source = data.source ?? this.source;
    this.area = data.area ?? this.area;

    if (data.verificationReports) {
      data.verificationReports.list.forEach((verificationReportData) => {
        const associateReport = this.verificationReports.find(
          (verificationReport) =>
            verificationReport.customerVerification.id ==
            verificationReportData.CustomerVerification_id
        );
        associateReport?.load(verificationReportData);
      });
    }
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

  getVerifiedReportList(): VerificationReport[] {
    return this.verificationReports.filter(
      (verificationReport) => !!verificationReport.id
    );
  }

  getUnverifiedReportList(): VerificationReport[] {
    return this.verificationReports.filter(
      (verificationReport) => !verificationReport.id
    );
  }

  countTotalVerifiedReportWeight(): number {
    let totalWeight: number = 0;
    this.getVerifiedReportList().forEach((verificationReport) => {
      totalWeight += verificationReport.id
        ? verificationReport.customerVerification.weight ?? 0
        : 0;
    });
    return totalWeight;
  }

  //
  toGraphqlVariables() {
    return {
      Area_id: this.area?.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      source: this.source,
    };
  }
  toJSON() {
    return {
      area: this.area,
      name: this.name,
      email: this.email,
      phone: this.phone,
      source: this.source,
    };
  }

  //
  isValidName(): ValidationResult {
    return isNotEmpty(this.name) || "name is mandatory";
  }
  isValidEmail(): ValidationResult {
    return !this.email ? true : (isEmail(this.email) || "email in valid format is mandatory");
  }
  isValidPhone(): ValidationResult {
    return isPhone(this.phone) || "phone in valid format is mandatory";
  }

  isValidToRegister(): boolean {
    return (
      this.isValidEmail() === true &&
      this.isValidName() === true &&
      this.isValidPhone() === true
      // !!this.area?.id
    );
  }
}
