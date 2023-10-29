import HttpRequestInterface from "./http-request-interface";
import { UserRoleDataType, UserRoleInterface } from "./role-interfaces";
import LayoutInterface from "@/resources/components/layout-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import UserRepository from "../user-repository";
import {
  generateBaseAppBarMenuItems,
  baseHome,
} from "@/shared/components/default-layout";

const ADMIN_ROLE_TYPE = "ADMIN";

export default class Admin implements UserRoleInterface {
  protected token: string;
  protected name: string;
  protected aSuperUser: boolean;
  readonly type: string = ADMIN_ROLE_TYPE;

  constructor(parameters: UserRoleDataType) {
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
          title: "customer verification",
          to: "/customer-verification",
        },
        {
          title: "sales activity",
          to: "/sales-activity",
        },
        {
          title: "manager",
          to: "/manager",
        },
        {
          title: "sales",
          to: "/sales",
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
