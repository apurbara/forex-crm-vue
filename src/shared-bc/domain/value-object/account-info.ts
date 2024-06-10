import {
  isEmail,
  isNotEmpty,
  isPassword,
} from "@/resources/composables/validator";
import {
  ValidationResult,
} from "@/resources/types/custom-types";

export type AccountInfoType = {
  name?: string;
  email?: string;
};

export default class AccountInfo {
  name: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(data: AccountInfoType = {}) {
    this.load(data);
  }

  load(data: AccountInfoType) {
    this.name = data.name ?? this.name;
    this.email = data.email ?? this.email;
  }

  isValidName(): ValidationResult {
    return isNotEmpty(this.name) || "name is required";
  }
  isValidEmail(): ValidationResult {
    return isEmail(this.email) || "valid email format is required";
  }
  isValidPassword(): ValidationResult {
    return isPassword(this.password) || "valid password format is required";
  }
  isValidConfirmPassword(): ValidationResult {
    return this.confirmPassword === this.password || "type same password";
  }

  isValidToCreate(): boolean {
    return (
      this.isValidName() === true &&
      this.isValidEmail() === true &&
      this.isValidPassword() === true &&
      this.isValidConfirmPassword() === true
    );
  }

  //
  toGraphqlVariables() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }
}
