import { ValidationResult } from "@/resources/types/custom-types";
import {
  isEmail,
  isNotEmpty,
  isPhone,
} from "@/resources/composables/validator";
import { VerificationReportType } from "./customer/verification-report";
import { CityType } from "./province/city";
import { CustomerStatusEnum } from "@/shared-bc/domain/enum/customer-status-enum";
import { GreetingAssignmentType } from "./manager/sales/greeting-assignment";
import { FactFindingAssignmentType } from "./manager/sales/fact-finding-assignment";
import { StrikingAssignmentType } from "./manager/sales/striking-assignment";

export type CustomerType = {
  id?: string;
  createdTime?: string;
  status?: CustomerStatusEnum;
  email?: string;
  name?: string;
  bio?: string;
  phone?: string;
  source?: string;
  rating?: number;
  City_id?: string;
  city?: CityType;
  verificationReports?: VerificationReportType[];
  greetingAssignments?: GreetingAssignmentType[];
  factFindingAssignments?: FactFindingAssignmentType[];
  strikingAssignments?: StrikingAssignmentType[];
};

export default class Customer {
  id?: string;
  email: string = "";
  name: string = "";
  bio: string = "";
  phone: string = "";
  source: string = "";
  rating?: number;
  city?: CityType;
  verificationReports: VerificationReportType[] = [];

  constructor(data: CustomerType = {}) {
    this.load(data);
  }

  load(data: CustomerType) {
    this.id = data.id ?? this.id;
    this.email = data.email ?? this.email;
    this.name = data.name ?? this.name;
    this.bio = data.bio ?? this.bio;
    this.phone = data.phone ?? this.phone;
    this.source = data.source ?? this.source;
    this.rating = data.rating ?? this.rating;
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
