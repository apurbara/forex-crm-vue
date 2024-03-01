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

export type SalesRoleType = {
  id?: string;
  disabled?: boolean;
  personnelRole: PersonnelRoleType;
};

const SALES_ROLE_TYPE = "SALES";

export default class SalesRole
  implements StoreableAuthInfo, UserRoleInterface, CompanyUserRoleInterface
{
  public id?: string;
  public disabled?: boolean;
  readonly type: string = SALES_ROLE_TYPE;

  constructor(protected personnelRole: PersonnelRole, params: SalesRoleType) {
    this.id = params.id;
    this.disabled = params.disabled;
  }

  static getRoleType() {
    return SALES_ROLE_TYPE;
  }

  isAuthenticated(): boolean {
    return true;
  }

  canAccess(menu: string): boolean {
    return ["sales-dashboard", "schedule", "assigned-customer"].includes(menu);
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
          title: "schedule",
          to: "/schedule",
        },
        {
          title: "assigned customer",
          to: "/assigned-customer",
        },
      ],
    };
  }

  getLandingPage(): string {
    return "/sales-dashboard";
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
  async executeSalesGraphqlMutation<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions | Fields
  ): Promise<ResponseType> {
    const fields = options instanceof Array ? options : [options];
    const response = await httpRequest.mutate<{ sales: ResponseType }>(
      "sales",
      {
        operation: "sales",
        variables: { salesId: { type: "ID", required: true, value: this.id } },
        fields: fields,
      },
      this.personnelRole.token
    );
    return response.sales;
  }

  async executeSalesGraphqlQuery<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions | Fields
  ): Promise<ResponseType> {
    const fields = options instanceof Array ? options : [options];
    const response = await httpRequest.query<{ sales: ResponseType }>(
      "sales",
      {
        operation: "sales",
        variables: { salesId: { type: "ID", required: true, value: this.id } },
        fields: fields,
      },
      this.personnelRole.token
    );
    return response.sales;
  }
}
