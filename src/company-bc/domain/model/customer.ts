import { ValidationResult } from "@/resources/types/custom-types";
import {
  isEmail,
  isNotEmpty,
  isPhone,
} from "@/resources/composables/validator";
import { VerificationReportType } from "./customer/verification-report";
import { CityType } from "./province/city";

export type CustomerType = {
  id?: string;
  createdTime?: string;
  email?: string;
  name?: string;
  phone?: string;
  source?: string;
  verificationScore?: number;
  City_id?: string;
  city?: CityType;
  verificationReports?: VerificationReportType[];
};

export default class Customer {
  id?: string;
  email: string = "";
  name: string = "";
  phone: string = "";
  source: string = "";
  city?: CityType;
  verificationReports: VerificationReportType[] = [];

  constructor(data: CustomerType = {}) {
    this.load(data);
  }

  load(data: CustomerType) {
    this.id = data.id ?? this.id;
    this.email = data.email ?? this.email;
    this.name = data.name ?? this.name;
    this.phone = data.phone ?? this.phone;
    this.source = data.source ?? this.source;
    this.city = data.city ?? this.city;

    this.verificationReports =
      data.verificationReports ?? this.verificationReports;
  }

  //
  toGraphqlVariables() {
    return {
      City_id: { type: "ID", required: true, value: this.city?.id },
      name: this.name,
      email: this.email,
      phone: this.phone,
      source: this.source,
    };
  }
  toJSON() {
    return {
      city: this.city,
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
    return isEmail(this.email) || "email in valid format is mandatory";
  }
  isValidPhone(): ValidationResult {
    return isPhone(this.phone) || "phone in valid format is mandatory";
  }

  isValidToRegister(): boolean {
    return (
      this.isValidEmail() === true &&
      this.isValidName() === true &&
      this.isValidPhone() === true &&
      !!this.city?.id
    );
  }
}
