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
import { SalesRoleEnum } from "@/shared-bc/domain/enum/sales-role-enum";

export type SalesRoleType = {
  role?: SalesRoleEnum;
} & CompanyUserRoleType;

export default class SalesRole implements CompanyUserRole {
  protected token: string;
  public role?: SalesRoleEnum;
  protected name?: string;
  static readonly type: string = "SALES";
  protected httpRequest: HttpRequestInterface;
  protected restRequest: RestRequestInterface;

  constructor(
    parameters: SalesRoleType,
    httpRequest: HttpRequestInterface,
    restRequest: RestRequestInterface
  ) {
    this.token = parameters.token!;
    this.role = parameters.role;
    this.name = parameters.name;
    this.httpRequest = httpRequest;
    this.restRequest = restRequest;
  }

  canAccessCompanyMenu(menu: string): boolean {
    return false;
  }
  getLandingPage(): string {
console.log(this.role);
    switch (this.role) {
      case SalesRoleEnum.STRIKER:
        return "/striker-dashboard";
      case SalesRoleEnum.FACT_FINDER:
        return "/fact-finder-dashboard";
      default:
        return "/greeter-dashboard";
    }
    // return "/sales-dashboard";
  }
  getLayout(): LayoutInterface {
    // const asSuperUserNavbarMenus = this.aSuperUser
    //   ? [{ title: "admin", to: "/admin" }]
    //   : [];
    var assignmentMenu;
    switch (this.role) {
      case SalesRoleEnum.STRIKER:
        assignmentMenu = {
          title: "sales striking assignment",
          to: "/sales-striking-assignment",
        };
        break;
      case SalesRoleEnum.FACT_FINDER:
        assignmentMenu = {
          title: "sales fact finding assignment",
          to: "/sales-fact-finding-assignment",
        };
        break;
      default:
        assignmentMenu = {
          title: "sales greeting assignment",
          to: "/sales-greeting-assignment",
        };
        break;
    }
    return {
      home: baseHome,
      appBarMenuItems: generateBaseAppBarMenuItems(this.name),
      navBarMenuItems: [
        assignmentMenu,
        // {
        //   title: "greeting assignment",
        //   to: "/sales-greeting-assignment",
        // },
        {
          title: "activity",
          to: "/sales-activity-schedule",
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
