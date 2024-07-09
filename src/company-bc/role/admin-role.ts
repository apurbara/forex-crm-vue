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

export type AdminRoleType = {
  aSuperUser?: boolean;
} & CompanyUserRoleType;

export default class AdminRole implements CompanyUserRole {
  protected token: string;
  protected name?: string;
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

  //
  canAccessCompanyMenu(menu: string): boolean {
    // const asSuperUserMenus = this.aSuperUser ? ["admin"] : [];
    return [
      // ...asSuperUserMenus,
      "common-sales-metric",
    ].includes(menu);
  }

  getLandingPage(): string {
    return "/admin-dashboard";
  }
  getLayout(): LayoutInterface {
    // const asSuperUserNavbarMenus = this.aSuperUser
    //   ? [{ title: "admin", to: "/admin" }]
    //   : [];
    return {
      home: baseHome,
      appBarMenuItems: generateBaseAppBarMenuItems(this.name),
      navBarMenuItems: [
        // ...asSuperUserNavbarMenus,
        {
          title: "province",
          to: "/province",
        },
        {
          title: "city",
          to: "/city",
        },
        {
          title: "common sales metric",
          to: "/common-sales-metric",
        },
        {
          title: "company metric",
          to: "/company-metric",
        },
        {
          title: "sales rank",
          to: "/sales-rank",
        },
        {
          title: "sales performance metric",
          to: "/sales-performance-metric",
        },
        {
          title: "customer journey",
          to: "/customer-journey",
        },
        {
          title: "customer verification",
          to: "/customer-verification",
        },
        {
          title: "manager",
          to: "/manager",
        },
        {
          title: "sales",
          to: "/sales",
        },
        {
          title: "sales activity",
          to: "/sales-activity",
        },
        {
          title: "customer",
          to: "/customer",
        },
        {
          title: "customer assignment",
          to: "/customer-assignment",
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

  //
  async uploadFile<ResponseType>(
    url: string,
    file: string | Blob,
    onUploadProgress: any
  ): Promise<ResponseType> {
    const response = await this.restRequest.uploadFile<ResponseType>(
      url,
      file,
      this.token,
      onUploadProgress
    );
    return response;
  }

  async downloadStream(
    url: string,
    params?: object,
    fileType?: string,
    label?: string
  ): Promise<void> {
    await this.restRequest.downloadStream(
      url,
      this.token,
      params,
      fileType,
      label
    );
  }
}
