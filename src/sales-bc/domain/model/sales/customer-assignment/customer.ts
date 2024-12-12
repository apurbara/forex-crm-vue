import { CustomerType } from "@/company-bc/domain/model/customer";
import { CityType } from "@/company-bc/domain/model/province/city";
import VerificationReport from "./customer/verification-report";
import { VerificationReportType } from "@/company-bc/domain/model/customer/verification-report";
import { CustomerVerificationType } from "@/company-bc/domain/model/customer-verification";
import { ValidationResult } from "@/resources/types/custom-types";
import { isEmail, isNotEmpty } from "@/resources/composables/validator";

export default class Customer {
  id?: string;
  name?: string;
  bio?: string;
  email?: string;
  phone?: string;
  rating?: number;
  source?: string;
  //
  city?: CityType;
  verificationReports: VerificationReport[] = [];

  constructor(data: CustomerType = {}) {
    this.load(data);
  }

  load(data: CustomerType) {
    this.id = data.id ?? this.id;
    this.name = data.name ?? this.name;
    this.bio = data.bio ?? this.bio;
    this.email = data.email ?? this.email;
    this.phone = data.phone ?? this.phone;
    this.rating = data.rating ?? this.rating;
    this.source = data.source ?? this.source;
    this.city = data.city ?? this.city;

    if (data.verificationReports) {
      data.verificationReports.forEach(
        (verificationReportData: VerificationReportType) => {
          this.verificationReports
            .find(
              (verificationReport) =>
                verificationReport.customerVerification?.id ===
                verificationReportData.CustomerVerification_id
            )
            ?.load(verificationReportData);
        }
      );
    }
  }

  //
  countTotalVerificationWeight(): number {
    return this.verificationReports?.reduce<number>(
      (accumulator, verificationReport: VerificationReport): number =>
        accumulator +
        (!verificationReport.id
          ? 0
          : verificationReport.customerVerification?.weight!),
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

  registerCustomerVerificationReports(
    customerVerificationList: CustomerVerificationType[]
  ): void {
    customerVerificationList.forEach((customerVerification) => {
      const verificationReport = new VerificationReport();
      verificationReport.customerVerification = customerVerification;
      this.verificationReports.push(verificationReport);
    });
  }

  //
  isValidName(): ValidationResult {
    return isNotEmpty(this.name) || "customer name is mandatory";
  }
  isValidEmail(): ValidationResult {
    return !this.email
      ? true
      : isEmail(this.email) || "invalid mail format";
  }
  isValidProperties(): boolean {
    return this.isValidName() === true && this.isValidEmail() === true;
  }

  //
  toGraphqlVariables() {
    return {
      name: this.name,
      email: this.email,
      bio: this.bio,
      City_id: { type: "ID", value: this.city?.id },
    };
  }
}
