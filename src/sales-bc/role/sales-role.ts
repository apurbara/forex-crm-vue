import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import { SalesRoleEnum } from "@/shared-bc/domain/enum/sales-role-enum";

export type SalesRoleType = {
  role?: SalesRoleEnum;
  token?: string;
  name?: string;
  type?: string;
};

export default class SalesRole {
  public role?: SalesRoleEnum;
  protected token: string;
  public name?: string;
  static readonly type: string = "SALES";
  protected httpRequest: HttpRequestInterface;
  protected restRequest: RestRequestInterface;

  constructor(
    parameters: SalesRoleType,
    httpRequest: HttpRequestInterface,
    restRequest: RestRequestInterface
  ) {
    this.role = parameters.role;
    this.token = parameters.token!;
    this.name = parameters.name;
    this.httpRequest = httpRequest;
    this.restRequest = restRequest;
  }

  // getLandingPage(): string {
  //   switch (this.role) {
  //     case SalesRoleEnum.GREETER:
  //       return "/greeter-dashboard";
  //     case SalesRoleEnum.FACT_FINDER:
  //       return "/fact-finder-dashboard";
  //     case SalesRoleEnum.STRIKER:
  //       return "/striker-dashboard";
  //     default:
  //       return "/striker-dashboard";
  //   }
  //   // return "/sales-dashboard";
  // }

  //
  async executeSalesGraphqlMutation<ResponseType>(
    options: GraphqlBuilderOptions | GraphqlBuilderOptions[]
  ): Promise<ResponseType> {
    const response = this.httpRequest.mutate("sales", options, this.token);
    return response;
  }

  async executeSalesGraphqlQuery<ResponseType>(
    options: GraphqlBuilderOptions | GraphqlBuilderOptions[]
  ): Promise<ResponseType> {
    const response = this.httpRequest.query("sales", options, this.token);
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
