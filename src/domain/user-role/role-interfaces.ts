import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import HttpRequestInterface from "./http-request-interface";
import LayoutInterface from "@/resources/components/layout-interface";
import UserRepository from "../user-repository";

// export type UserRoleDataType = {
//   token: string;
//   type: string;
//   name: string;
//   aSuperUser?: boolean;
// };

export interface UserRoleInterface {
  isAuthenticated(): boolean;
  canAccess(menu: string): boolean;
  getLayout(userRepository: UserRepository): LayoutInterface;
  getLandingPage(): string;
  executeGraphqlMutation<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;

  executeGraphqlQuery<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;
}

export interface CompanyUserRoleInterface extends UserRoleInterface {
  executeGraphqlMutationInCompany<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;

  executeGraphqlQueryInCompany<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;
}
