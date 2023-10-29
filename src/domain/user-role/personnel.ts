import HttpRequestInterface from "./http-request-interface";
import {
  CompanyUserRoleInterface,
  UserRoleDataType,
  UserRoleInterface,
} from "./role-interfaces";
import LayoutInterface from "@/resources/components/layout-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import UserRepository from "../user-repository";
import {
  generateBaseAppBarMenuItems,
  baseHome,
} from "@/shared/components/default-layout";

const PERSONNEL_ROLE_TYPE = "PERSONNEL";

export default class Personnel
  implements UserRoleInterface, CompanyUserRoleInterface
{
  protected token: string;
  protected name: string;
  readonly type: string = PERSONNEL_ROLE_TYPE;

  constructor(parameters: UserRoleDataType) {
    this.token = parameters.token;
    this.name = parameters.name;
  }

  static getRoleType() {
    return PERSONNEL_ROLE_TYPE;
  }

  getName(): string {
    return this.name;
  }

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

  hasSuperUserRole(): boolean {
    return false;
  }
}
