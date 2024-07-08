import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";

export type ManagerRoleType = {
  token?: string;
  name?: string;
  type?: string;
};

export default class ManagerRole {
  protected token: string;
  public name?: string;
  static readonly type: string = "MANAGER";
  protected httpRequest: HttpRequestInterface;
  protected restRequest: RestRequestInterface;

  constructor(
    parameters: ManagerRoleType,
    httpRequest: HttpRequestInterface,
    restRequest: RestRequestInterface
  ) {
    this.token = parameters.token!;
    this.name = parameters.name;
    this.httpRequest = httpRequest;
    this.restRequest = restRequest;
  }

  getLandingPage(): string {
    return "/manager-dashboard";
  }

  //
  async executeManagerGraphqlMutation<ResponseType>(
    options: GraphqlBuilderOptions | GraphqlBuilderOptions[]
  ): Promise<ResponseType> {
    const response = this.httpRequest.mutate("manager", options, this.token);
    return response;
  }

  async executeManagerGraphqlQuery<ResponseType>(
    options: GraphqlBuilderOptions | GraphqlBuilderOptions[]
  ): Promise<ResponseType> {
    const response = this.httpRequest.query("manager", options, this.token);
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
