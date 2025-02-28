import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import CompanyUserRepository, {
  CompanyUserRole,
  CompanyUserRoleType,
} from "./company-user-repository";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import {
  baseHome,
  generateBaseAppBarMenuItems,
} from "@/shared/components/default-layout";
import LayoutInterface from "@/resources/components/layout-interface";

export default class ManagerRole implements CompanyUserRole {
  protected token: string;
  protected name?: string;
  static readonly type: string = "MANAGER";
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
    return ["customer"].includes(menu);
  }
  getLandingPage(): string {
    return "/manager-dashboard";
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
          title: "greeting assignment",
          to: "/manager-greeting-assignment",
        },
        {
          title: "fact finding assignment",
          to: "/manager-fact-finding-assignment",
        },
        {
          title: "striking assignment",
          to: "/manager-striking-assignment",
        },
        {
          title: "closing request",
          to: "/manager-closing-request",
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
