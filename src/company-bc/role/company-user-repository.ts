import RegularException from "@/resources/exception/regular-exception";
import AdminRole from "./admin-role";
import ManagerRole from "./manager-role";
import SalesRole from "./sales-role";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import LayoutInterface from "@/resources/components/layout-interface";
import router from "@/router";

export type CompanyUserRoleType = {
  token?: string;
  name?: string;
  type?: string;
};

export interface CompanyUserRole {
  executeGraphqlMutationInCompany<ResponseType>(
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;
  executeGraphqlQueryInCompany<ResponseType>(
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;
  executeGetRequest<ResponseType>(
    url: string,
    queryParameters?: any
  ): Promise<ResponseType>;
  executePostRequest<ResponseType>(
    url: string,
    data?: any
  ): Promise<ResponseType>;
  canAccessCompanyMenu(menu: string): boolean;
  getLayout(): LayoutInterface;
  getLandingPage(): string;
}

export default class CompanyUserRepository {
  protected httpRequest: HttpRequestInterface;
  protected restRequest: RestRequestInterface;
  protected user?: CompanyUserRole;

  constructor(
    httpRequest: HttpRequestInterface,
    restRequest: RestRequestInterface
  ) {
    this.httpRequest = httpRequest;
    this.restRequest = restRequest;
    const userParameters = localStorage.getItem("user");
    if (userParameters) {
      const userData: CompanyUserRoleType = JSON.parse(userParameters);
      this.logUserIn(userData);
    }
  }
  //
  getUser<Role extends CompanyUserRole = CompanyUserRole>(): Role | undefined {
    return this.user as Role;
  }

  //
  logUserIn(userData: CompanyUserRoleType): void {
    switch (userData.type) {
      case AdminRole.type:
        this.user = new AdminRole(userData, this.httpRequest, this.restRequest);
        break;
      case ManagerRole.type:
        this.user = new ManagerRole(
          userData,
          this.httpRequest,
          this.restRequest
        );
        break;
      case SalesRole.type:
        this.user = new SalesRole(userData, this.httpRequest, this.restRequest);
        break;
      default:
        return;
    }
    localStorage.setItem("user", JSON.stringify(userData));
    router.push(this.user.getLandingPage());
  }

  logUserOut(): void {
    this.user = undefined;
    localStorage.clear();
    router.push("/");
  }
}
