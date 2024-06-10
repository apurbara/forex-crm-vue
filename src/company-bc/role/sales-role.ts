import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import { CompanyUserRole, CompanyUserRoleType } from "./company-user-repository";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";

export default class SalesRole implements CompanyUserRole {
  protected token: string;
  static readonly type: string = "SALES";

  constructor(parameters: CompanyUserRoleType) {
    this.token = parameters.token!;
  }

  canAccessCompanyMenu(menu: string): boolean {
    return false;
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
