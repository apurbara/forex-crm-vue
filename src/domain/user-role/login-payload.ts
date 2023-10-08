import { isEmail, isNotEmpty } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/composables/common-types";

export default class LoginPayload {
  constructor(public email: string = "", public password: string = "") {}

  isValidEmail(): ValidationResult {
    return isEmail(this.email) || "valid email format is mandatory";
  }
  isValidPassword(): ValidationResult {
    return isNotEmpty(this.password) || "password is mandatory";
  }

  isValidLoginPayload(): boolean {
    return this.isValidEmail() === true && this.isValidPassword() === true;
  }
}
