import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import CompanyUserRepository, {
  CompanyUserRole,
  CompanyUserRoleType,
} from "./company-user-repository";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import LayoutInterface from "@/resources/components/layout-interface";
import {
  baseHome,
  generateBaseAppBarMenuItems,
} from "@/shared/components/default-layout";

export default class SalesRole implements CompanyUserRole {
  protected token: string;
  protected name?: string;
  static readonly type: string = "SALES";
  protected httpRequest: HttpRequestInterface;
  protected restRequest: RestRequestInterface;

  constructor(
    parameters: CompanyUserRoleType,
    httpRequest: HttpRequestInterface,
    restRequest: RestRequestInterface
  ) {
    this.token = parameters.token!;
    this.name = parameters.name;
    this.httpRequest = httpRequest;
    this.restRequest = restRequest;
  }

  canAccessCompanyMenu(menu: string): boolean {
    return false;
  }
  getLandingPage(): string {
    return "/sales-dashboard";
  }
  getLayout(): LayoutInterface {
    // const asSuperUserNavbarMenus = this.aSuperUser
    //   ? [{ title: "admin", to: "/admin" }]
    //   : [];
    return {
      home: baseHome,
      appBarMenuItems: generateBaseAppBarMenuItems(this.name),
      navBarMenuItems: [
        {
          title: "customer assignment",
          to: "/sales-customer-assignment",
        },
        {
          title: "activity",
          to: "/sales-activity",
        },
      ],
    };
  }

  //
  async executeGraphqlMutationInCompany<ResponseType>(
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    const response = await this.httpRequest.mutate(
      "company",
      options,
      this.token
    );
    return response;
  }

  async executeGraphqlQueryInCompany<ResponseType>(
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    const response = await this.httpRequest.query(
      "company",
      options,
      this.token
    );
    return response;
  }

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
