import HttpRequestInterface from "./http-request-interface";
import { CompanyUserRoleInterface, UserRoleInterface } from "./role-interfaces";
import LayoutInterface from "@/resources/components/layout-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import UserRepository, { StoreableAuthInfo } from "../user-repository";
import {
  generateBaseAppBarMenuItems,
  baseHome,
} from "@/shared/components/default-layout";
import AbstractPagination, {
  PaginationResponseType,
} from "@/resources/components/abstract-pagination";
import SalesRole, { SalesRoleType } from "./personnel/sales-role";
import { LoginAuthInfo } from "./login-payload";

const PERSONNEL_ROLE_TYPE = "PERSONNEL";

export type PersonnelRoleType = {
  salesAssignments?: PaginationResponseType<SalesRoleType>;
} & LoginAuthInfo;

export default class PersonnelRole
  implements StoreableAuthInfo, UserRoleInterface, CompanyUserRoleInterface
{
  public id: string;
  public token: string;
  public name: string;
  readonly type: string = PERSONNEL_ROLE_TYPE;

  constructor(parameters: PersonnelRoleType) {
    this.token = parameters.token!;
    this.name = parameters.name!;
    this.id = parameters.id!;
  }

  static getRoleType() {
    return PERSONNEL_ROLE_TYPE;
  }

  authorizeAsSales(params: SalesRoleType) {
    return new SalesRole(this, params);
  }

  //
  isAuthenticated(): boolean {
    return true;
  }

  canAccess(menu: string): boolean {
    return ["area"].includes(menu);
  }

  getLandingPage(): string {
    return "/personnel-dashboard";
  }

  getLayout(userRepository: UserRepository): LayoutInterface {
    return {
      home: baseHome,
      appBarMenuItems: generateBaseAppBarMenuItems(userRepository, this.name),
      navBarMenuItems: [
        {
          title: "firm",
          to: "/firm",
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
        operation: "byPersonnel",
        fields: [options],
      },
      this.token
    );
    return response.byPersonnel;
  }
  async executeGraphqlQuery<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    const response = await httpRequest.query(
      "user",
      {
        operation: "byPersonnel",
        fields: [options],
      },
      this.token
    );
    return response.byPersonnel;
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
}
