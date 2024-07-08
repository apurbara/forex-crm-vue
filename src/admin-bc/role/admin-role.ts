import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";

export type AdminRoleType = {
  token?: string;
  name?: string;
  type?: string;
  aSuperUser?: boolean;
};

export default class AdminRole {
  protected token: string;
  public name?: string;
  protected aSuperUser: boolean;
  static readonly type: string = "ADMIN";
  protected httpRequest: HttpRequestInterface;
  protected restRequest: RestRequestInterface;

  constructor(
    parameters: AdminRoleType,
    httpRequest: HttpRequestInterface,
    restRequest: RestRequestInterface
  ) {
    this.token = parameters.token!;
    this.name = parameters.name;
    this.aSuperUser = parameters.aSuperUser!;
    this.httpRequest = httpRequest;
    this.restRequest = restRequest;
  }

  getLandingPage(): string {
    return "/admin-dashboard";
  }

  //
  async executeAdminGraphqlMutation<ResponseType>(
    options: GraphqlBuilderOptions | GraphqlBuilderOptions[]
  ): Promise<ResponseType> {
    const response = this.httpRequest.mutate("admin", options, this.token);
    return response;
  }

  async executeAdminGraphqlQuery<ResponseType>(
    options: GraphqlBuilderOptions | GraphqlBuilderOptions[]
  ): Promise<ResponseType> {
    const response = this.httpRequest.query("admin", options, this.token);
    return response;
  }
  //
  async executeGetRequest<ResponseType>(
    url: string,
    queryParameters?: any
  ): Promise<ResponseType> {
    return await this.restRequest.get(url, queryParameters, this.token);
  }

  async executePostRequest<ResponseType>(
    url: string,
    data?: any
  ): Promise<ResponseType> {
    return await this.restRequest.post(url, data, this.token);
  }
}
