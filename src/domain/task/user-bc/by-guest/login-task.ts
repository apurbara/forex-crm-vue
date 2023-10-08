import HttpRequestInterface from "@/domain/http-request-interface";
import LoginPayload from "@/domain/user-role/login-payload";
import UserRoleDataInterface from "@/domain/user-role/user-role-data-interface";

export default class LoginTask {
  constructor(protected httpRequest: HttpRequestInterface) {}

  async adminLogin(loginPayload: LoginPayload): Promise<UserRoleDataInterface> {
    return await this.httpRequest.post("/admin-login", loginPayload);
  }

  async managerLogin(
    loginPayload: LoginPayload
  ): Promise<UserRoleDataInterface> {
    return await this.httpRequest.post("/manager-login", loginPayload);
  }

  async salesLogin(loginPayload: LoginPayload): Promise<UserRoleDataInterface> {
    return await this.httpRequest.post("/sales-login", loginPayload);
  }
}
