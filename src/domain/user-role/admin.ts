import LayoutInterface from "@/resources/components/layout-interface";
import UserRepository from "../user-repository";
import {
  generateBaseAppBarMenuItems,
  baseHome,
} from "@/shared/components/default-layout";
import UserRoleInterface from "../user-role-interface";
import UserRoleDataInterface from "./user-role-data-interface";
import HttpRequestInterface from "../http-request-interface";

const ADMIN_ROLE_TYPE = "ADMIN";

export default class Admin implements UserRoleInterface {
  protected token: string;
  protected name: string;
  protected aSuperUser: boolean;
  readonly type: string = ADMIN_ROLE_TYPE;

  constructor(parameters: UserRoleDataInterface) {
    this.token = parameters.token;
    this.name = parameters.name;
    this.aSuperUser = parameters.aSuperUser!;
  }

  static getRoleType() {
    return ADMIN_ROLE_TYPE;
  }

  getName(): string {
    return this.name;
  }

  isAuthenticated(): boolean {
    return true;
  }

  canAccess(menu: string): boolean {
    return true;
    // const asSuperUserMenus = this.aSuperUser ? ["admin"] : [];
    // return [...asSuperUserMenus, "manager", "sales"].includes(menu);
  }

  getLayout(userRepository: UserRepository): LayoutInterface {
    const asSuperUserNavbarMenus = this.aSuperUser
      ? [{ title: "admin", to: "/admin" }]
      : [];
    return {
      home: baseHome,
      appBarMenuItems: generateBaseAppBarMenuItems(userRepository, this.name),
      navBarMenuItems: [
        ...asSuperUserNavbarMenus,
        { title: "manager", to: "/manager" },
        { title: "sales", to: "/sales" },
        { title: "product", to: "/product" },
        { title: "mail content", to: "/mail-content" },
        { title: "sales mission", to: "/sales-mission" },
      ],
    };
  }

  getLandingPage(): string {
    return "/product";
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
    return await httpRequest.get(endPoint, this.token, params);
  }
}