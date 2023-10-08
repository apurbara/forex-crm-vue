import LayoutInterface from "@/resources/components/layout-interface";
import {
  generateBaseAppBarMenuItems,
  baseHome,
} from "@/shared/components/default-layout";
import UserRepository from "../user-repository";
import UserRoleInterface from "../user-role-interface";
import UserRoleDataInterface from "./user-role-data-interface";
import HttpRequestInterface from "../http-request-interface";

const MANAGER_ROLE_TYPE = "MANAGER";

export default class Manager implements UserRoleInterface {
  protected token: string;
  protected name: string;
  readonly type: string = MANAGER_ROLE_TYPE;

  static getRoleType() {
    return MANAGER_ROLE_TYPE;
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
    // return ["sales"].includes(menu);
  }
  getLayout(userRepository: UserRepository): LayoutInterface {
    return {
      home: { ...baseHome, to: "/manager-dashboard" },
      appBarMenuItems: generateBaseAppBarMenuItems(userRepository, this.name),
      navBarMenuItems: [
        { title: "article", to: "/article" },
        { title: "sales", to: "/sales-summary" },
        { title: "customer", to: "/customer-summary" },
      ],
    };
  }
  getLandingPage(): string {
    return "/manager-dashboard";
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
