import { ValidationResult } from "@/resources/types/custom-types";
import { AreaType } from "../../../dependency-model/area";
import { isEmail, isNotEmpty } from "@/resources/composables/validator";
import VerificationReport, { VerificationReportType } from "./customer/verification-report";
import { CustomerVerificationType } from "@/sales-bc/domain/dependency-model/customer-verification";

export type CustomerType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  //
  Area_id?: string;
  area?: AreaType;
  //
  verificationReports?: VerificationReportType[];
}

export default class Customer {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  //
  area?: AreaType;
  verificationReports: VerificationReport[] = [];

  constructor(data: CustomerType = {}) {
    this.load(data);
  }

  load(data: CustomerType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.name = data.name ?? this.name;
    this.email = data.email ?? this.email;
    this.phone = data.phone ?? this.phone;
    this.source = data.source ?? this.source;
    this.area = data.area ?? this.area;

    if (data.verificationReports) {
      data.verificationReports.forEach((verificationReportData: VerificationReportType) => {
        this.verificationReports.find(
          (verificationReport) => verificationReport.customerVerification?.id === verificationReportData.CustomerVerification_id
        )?.load(verificationReportData);
      });
    }
  }

  //
  countTotalVerificationWeight(): number {
    return this.verificationReports?.reduce<number>(
      (accumulator, verificationReport: VerificationReport): number => accumulator + (!verificationReport.id ? 0 : verificationReport.customerVerification?.weight!),
      0
    )!;
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

  registerCustomerVerificationReports(customerVerificationList: CustomerVerificationType[]): void {
    customerVerificationList.forEach((customerVerification) => {
      const verificationReport = new VerificationReport();
      verificationReport.customerVerification = customerVerification;
      this.verificationReports.push(verificationReport);
    });
  }

  //
  isValidName(): ValidationResult {
    return isNotEmpty(this.name) || 'customer name is mandatory';
  }
  isValidEmail(): ValidationResult {
    return !this.email ? true : (isEmail(this.email) || 'customer name is mandatory');
  }
  isValidProperties(): boolean {
    return this.isValidName() === true &&
      this.isValidEmail() === true;
  }

  //
  toGraphqlVariables() {
    return {
      name: this.name,
      email: this.email,
      Area_id: this.area?.id,
    };
  }
}