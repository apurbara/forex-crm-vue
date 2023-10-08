import LayoutInterface from "@/resources/components/layout-interface";
import {
  generateBaseAppBarMenuItems,
  baseHome,
} from "@/shared/components/default-layout";
import UserRepository from "../user-repository";
import UserRoleInterface from "../user-role-interface";
import UserRoleDataInterface from "./user-role-data-interface";
import HttpRequestInterface from "../http-request-interface";

const SALES_ROLE_TYPE = "SALES";

export default class Sales implements UserRoleInterface {
  protected token: string;
  protected name: string;
  readonly type: string = SALES_ROLE_TYPE;

  static getRoleType() {
    return SALES_ROLE_TYPE;
  }

  constructor(parameters: UserRoleDataInterface) {
    this.token = parameters.token;
    this.name = parameters.name;
  }

  isAuthenticated(): boolean {
    return true;
  }
  getName(): string {
    return this.name;
  }
  canAccess(menu: string): boolean {
    return true;
    // return ["assigned-prospect"].includes(menu);
  }
  getLayout(userRepository: UserRepository): LayoutInterface {
    return {
      home: { ...baseHome, to: "/sales-dashboard" },
      appBarMenuItems: generateBaseAppBarMenuItems(userRepository, this.name),
      navBarMenuItems: [],
    };
  }
  getLandingPage(): string {
    return "/sales-dashboard";
  }

  //
  getToken(): string {
    return this.token;
  }

  async submitPostRequest<PayloadType, ExpectedResponseType>(
    httpRequest: HttpRequestInterface,
    endPoint: string,
    payload: PayloadType
  ): Promise<ExpectedResponseType> {
    return await httpRequest.post(endPoint, payload, this.token);
  }

  async submitGetRequest<ExpectedResponseType>(
    httpRequest: HttpRequestInterface,
    endPoint: string,
    params?: { [key: string]: string }
  ): Promise<ExpectedResponseType> {
    console.log(endPoint);
    return await httpRequest.get(endPoint, this.token, params);
  }
}
