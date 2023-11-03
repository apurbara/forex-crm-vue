import { isEmail, isNotEmpty } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types";

export type LoginAuthInfo = {
  id?: string;
  name?: string;
  token?: string;
};

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

  //
  toGraphqlVariable() {
    return {
      email: { value: this.email, required: true },
      password: { value: this.password, required: true },
    };
  }
}
