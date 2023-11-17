import HttpRequestInterface from "./http-request-interface";
import { UserRoleInterface } from "./role-interfaces";
import LayoutInterface from "@/resources/components/layout-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import UserRepository, { StoreableAuthInfo } from "../user-repository";
import {
  generateBaseAppBarMenuItems,
  baseHome,
} from "@/shared/components/default-layout";
import { LoginAuthInfo } from "./login-payload";

const ADMIN_ROLE_TYPE = "ADMIN";

export type AdminRoleType = {
  aSuperUser?: boolean;
} & LoginAuthInfo;

export default class AdminRole implements StoreableAuthInfo, UserRoleInterface {
  public id: string;
  public token: string;
  public name: string;
  public aSuperUser: boolean;
  readonly type: string = ADMIN_ROLE_TYPE;

  constructor(parameters: AdminRoleType) {
    this.token = parameters.token!;
    this.name = parameters.name!;
    this.id = parameters.id!;
    this.aSuperUser = parameters.aSuperUser!;
  }

  static getRoleType() {
    return ADMIN_ROLE_TYPE;
  }

  isAuthenticated(): boolean {
    return true;
  }

  getLandingPage(): string {
    return "/personnel";
  }

  canAccess(menu: string): boolean {
    const asSuperUserMenus = this.aSuperUser ? ["admin"] : [];
    return [
      ...asSuperUserMenus,
      "firm",
      "area-structure",
      "area",
      "customer-verification",
      "sales-activity",
      "customer-journey",
    ].includes(menu);
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
        {
          title: "area structure",
          to: "/area-structure",
        },
        {
          title: "area",
          to: "/area",
        },
        {
          title: "personnel",
          to: "/personnel",
        },
        {
          title: "manager",
          to: "/manager",
        },
        {
          title: "sales",
          to: "/sales",
        },
        {
          title: "customer verification",
          to: "/customer-verification",
        },
        {
          title: "sales activity",
          to: "/sales-activity",
        },
        {
          title: "customer journey",
          to: "/customer-journey",
        },
      ],
    };
  }

  //
  async executeGraphqlMutation<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    const response = await httpRequest.mutate(
      "user",
      {
        operation: "byAdmin",
        fields: [options],
      },
      this.token
    );
    return response.byAdmin;
  }
  async executeGraphqlQuery<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    const response = await httpRequest.query(
      "user",
      {
        operation: "byAdmin",
        fields: [options],
      },
      this.token
    );
    return response.byAdmin;
  }

  //
  async executeGraphqlMutationInCompany<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    const response = await httpRequest.mutate("company", options, this.token);
    return response;
  }

  async executeGraphqlQueryInCompany<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    const response = await httpRequest.query("company", options, this.token);
    return response;
  }

  hasSuperUserRole(): boolean {
    return this.aSuperUser;
  }
}
