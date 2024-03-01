import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import HttpRequestInterface from "../http-request-interface";
import PersonnelRole, { PersonnelRoleType } from "../personnel-role";
import UserRepository, { StoreableAuthInfo } from "@/domain/user-repository";
import {
  CompanyUserRoleInterface,
  UserRoleInterface,
} from "../role-interfaces";
import {
  baseHome,
  generateBaseAppBarMenuItems,
} from "@/shared/components/default-layout";
import LayoutInterface from "@/resources/components/layout-interface";
import Fields from "gql-query-builder/build/Fields";
import RestRequestInterface from "../rest-request-interface";

export type ManagerRoleType = {
  id?: string;
  disabled?: boolean;
  personnelRole: PersonnelRoleType;
};

const MANAGER_ROLE_TYPE = "MANAGER";

export default class ManagerRole
  implements StoreableAuthInfo, UserRoleInterface, CompanyUserRoleInterface
{
  public id?: string;
  public disabled?: boolean;
  readonly type: string = MANAGER_ROLE_TYPE;

  constructor(protected personnelRole: PersonnelRole, params: ManagerRoleType) {
    this.id = params.id;
    this.disabled = params.disabled;
  }

  static getRoleType() {
    return MANAGER_ROLE_TYPE;
  }

  isAuthenticated(): boolean {
    return true;
  }

  canAccess(menu: string): boolean {
    return [
      "manager-dashboard",
      "manager-customer-assignment",
      "customer",
    ].includes(menu);
  }

  getLayout(userRepository: UserRepository): LayoutInterface {
    return {
      home: baseHome,
      appBarMenuItems: generateBaseAppBarMenuItems(
        userRepository,
        this.personnelRole.name
      ),
      navBarMenuItems: [
        {
          title: "customer assignment",
          to: "/manager-customer-assignment",
        },
        {
          title: "customer",
          to: "/customer",
        },
      ],
    };
  }

  getLandingPage(): string {
    return "/manager-dashboard";
  }

  async executeGraphqlMutation<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    return await this.personnelRole.executeGraphqlMutation(
      httpRequest,
      options
    );
  }

  async executeGraphqlQuery<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    return await this.personnelRole.executeGraphqlQuery(httpRequest, options);
  }

  //
  async executeGraphqlMutationInCompany<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    return await this.personnelRole.executeGraphqlMutationInCompany(
      httpRequest,
      options
    );
  }

  async executeGraphqlQueryInCompany<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    return await this.personnelRole.executeGraphqlQueryInCompany(
      httpRequest,
      options
    );
  }

  //
  async executeManagerGraphqlMutation<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions | Fields
  ): Promise<ResponseType> {
    const fields = options instanceof Array ? options : [options];
    const response = await httpRequest.mutate<{ manager: ResponseType }>(
      "manager",
      {
        operation: "manager",
        variables: {
          managerId: { type: "ID", required: true, value: this.id },
        },
        fields: fields,
      },
      this.personnelRole.token
    );
    return response.manager;
  }

  async executeManagerGraphqlQuery<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions | Fields
  ): Promise<ResponseType> {
    const fields = options instanceof Array ? options : [options];
    const response = await httpRequest.query<{ manager: ResponseType }>(
      "manager",
      {
        operation: "manager",
        variables: {
          managerId: { type: "ID", required: true, value: this.id },
        },
        fields: fields,
      },
      this.personnelRole.token
    );
    return response.manager;
  }

  async uploadFile<ResponseType>(
    restRequest: RestRequestInterface,
    url: string,
    file: string | Blob,
    onUploadProgress: any
  ): Promise<ResponseType> {
    const response = await restRequest.uploadFile<ResponseType>(
      url,
      file,
      this.personnelRole.token,
      onUploadProgress
    );
    return response;
  }

  async downloadStream(
    restRequest: RestRequestInterface,
    url: string,
    params?: object,
    fileType?: string,
    label?: string
  ): Promise<void> {
    await restRequest.downloadStream(
      url,
      this.personnelRole.token,
      params,
      fileType,
      label
    );
  }
}
