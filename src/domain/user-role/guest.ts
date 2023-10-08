import LayoutInterface from "@/resources/components/layout-interface";
import UserRoleInterface from "../user-role-interface";
import HttpRequestInterface from "../http-request-interface";

export default class Guest implements UserRoleInterface {
  isAuthenticated(): boolean {
    return false;
  }

  canAccess(menu: string): boolean {
    return ["login", "admin-login", "home"].includes(menu);
  }

  getLayout(): LayoutInterface {
    return GUEST_LAYOUT;
  }

  getToken(): string | undefined {
    return undefined;
  }

  getLandingPage(): string {
    return "/home";
  }

  //
  async submitPostRequest<PayloadType, ExpectedResponseType>(
    httpRequest: HttpRequestInterface,
    endPoint: string,
    payload: PayloadType
  ): Promise<ExpectedResponseType> {
    return await httpRequest.post(endPoint, payload);
  }

  async submitGetRequest<ExpectedResponseType>(
    httpRequest: HttpRequestInterface,
    endPoint: string,
    params?: { [key: string]: string } | undefined
  ): Promise<ExpectedResponseType> {
    return await httpRequest.get(endPoint, undefined, params);
  }
}

const GUEST_LAYOUT: LayoutInterface = {
  home: {
    title: "forex",
    to: "/home",
  },
  appBarMenuItems: [
    {
      title: "login",
      icon: "mdi-login",
      to: "/login",
    },
  ],
};
