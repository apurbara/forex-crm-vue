import LayoutInterface from "@/resources/components/layout-interface";
import UserRepository from "./user-repository";
import HttpRequestInterface from "./http-request-interface";

export default interface UserRoleInterface {
  isAuthenticated(): boolean;

  getLayout(userRepository: UserRepository): LayoutInterface;

  canAccess(menu: string): boolean;

  getToken(): string | undefined;

  getLandingPage(): string;

  submitPostRequest<PayloadType, ExpectedResponseType>(
    httpRequest: HttpRequestInterface,
    endPoint: string,
    payload: PayloadType
  ): Promise<ExpectedResponseType>;

  submitGetRequest<ExpectedResponseType>(
    httpRequest: HttpRequestInterface,
    endPoint: string,
    params?: { [key: string]: string }
  ): Promise<ExpectedResponseType>;
}
