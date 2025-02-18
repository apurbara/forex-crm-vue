import { ValidationResult } from "@/resources/types/custom-types";
import { isEmail, isNotEmpty } from "@/resources/composables/validator";
import VerificationReport, { VerificationReportType } from "./customer/verification-report";
import { CityType } from "@/company-bc/domain/model/province/city";
import { CustomerVerificationType } from "@/company-bc/domain/model/customer-verification";

export type CustomerType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  //
  City_id?: string;
  city?: CityType;
  //
  verificationReports?: VerificationReportType[];
};

export default class Customer {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  //
  city?: CityType;
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
    this.city = data.city ?? this.city;

    if (data.verificationReports) {
      data.verificationReports.forEach((verificationReportData: VerificationReportType) => {
        this.verificationReports.push(new VerificationReport(verificationReportData));
        // this.verificationReports
        //   .find(
        //     (verificationReport) =>
        //       verificationReport.customerVerification?.id ===
        //       verificationReportData.CustomerVerification_id
        //   )
        //   ?.load(verificationReportData);
      });
    }
  }

  //
  countTotalVerificationWeight(): number {
    return this.verificationReports?.reduce<number>(
      (accumulator, verificationReport: VerificationReport): number =>
        accumulator +
        (!verificationReport.id ? 0 : verificationReport.customerVerification?.weight!),
      0
    )!;
    // return this.verificationReports.reduce<number>(
    //   (acc, verificationReport: VerificationReport) =>
    //     acc +
    //     (allActiveCustomerVerification.find(
    //       (el) => el.id === verificationReport.CustomerVerification_id
    //     )?.weight ?? 0),
    //   0
    // );
  }

  // getVerifiedReportList(): VerificationReport[] {
  //   return this.verificationReports.filter((verificationReport) => !!verificationReport.id);
  // }

  // getUnverifiedReportList(): VerificationReport[] {
  //   return this.verificationReports.filter((verificationReport) => !verificationReport.id);
  // }

  registerCustomerVerificationReports(customerVerificationList: CustomerVerificationType[]): void {
    // customerVerificationList.forEach((customerVerification) => {
    //   const verificationReport = new VerificationReport();
    //   verificationReport.customerVerification = customerVerification;
    //   this.verificationReports.push(verificationReport);
    // });
    this.verificationReports.forEach((verificationReport) => {
      verificationReport.customerVerification = customerVerificationList.find(
        (verification) => verification.id === verificationReport.CustomerVerification_id
      );
    });
  }

  //
  isValidName(): ValidationResult {
    return isNotEmpty(this.name) || "customer name is mandatory";
  }
  isValidEmail(): ValidationResult {
    return !this.email ? true : isEmail(this.email) || "invalid mail format";
  }
  isValidProperties(): boolean {
    return this.isValidName() === true && this.isValidEmail() === true;
  }

  //
  toGraphqlVariables() {
    return {
      name: this.name,
      email: this.email,
      City_id: this.city?.id,
    };
  }
}
