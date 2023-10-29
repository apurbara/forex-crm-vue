import { UserRepository } from '@/domain/user-repository';
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import HttpRequestInterface from "./http-request-interface";
import LayoutInterface from "@/resources/components/layout-interface";
import UserRepository from "../user-repository";

export type UserRoleDataType = {
  token: string;
  type: string;
  name: string;
  aSuperUser?: boolean;
};

export interface UserRoleInterface {
  executeGraphqlMutation<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;

  executeGraphqlQuery<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;

  isAuthenticated(): boolean;
  canAccess(menu: string): boolean;
  getLayout(userRepository: UserRepository): LayoutInterface;
  getLandingPage(): string;
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

export interface SalesUserRoleInterface extends CompanyUserRoleInterface {
  executeSalesGraphqlMutation<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;

  executeSalesGraphqlQuery<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType>;
}
