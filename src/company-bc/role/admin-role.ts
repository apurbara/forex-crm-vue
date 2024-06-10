import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import { CompanyUserRole, CompanyUserRoleType } from "./company-user-repository";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";

export type AdminRoleType = {
  aSuperUser?: boolean;
} & CompanyUserRoleType;

export default class AdminRole implements CompanyUserRole {
  protected token: string;
  protected aSuperUser: boolean;
  static readonly type: string = "ADMIN";

  constructor(parameters: AdminRoleType) {
    this.token = parameters.token!;
    this.aSuperUser = parameters.aSuperUser!;
  }
  canAccessCompanyMenu(menu: string): boolean {
    // const asSuperUserMenus = this.aSuperUser ? ["admin"] : [];
    return [
      // ...asSuperUserMenus,
      "common-sales-metric",
    ].includes(menu);
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

  async executeGetRequest<ResponseType>(
    restRequest: RestRequestInterface, url: string, queryParameters?: any
  ): Promise<ResponseType> {
    return await restRequest.get(url, queryParameters, this.token);
  }

  async executePostRequest<ResponseType>(
    restRequest: RestRequestInterface, url: string, data?: any
  ): Promise<ResponseType> {
    return await restRequest.post(url, data, this.token);
  }
}
