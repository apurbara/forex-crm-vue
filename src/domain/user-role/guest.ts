import HttpRequestInterface from "./http-request-interface";
import { UserRoleInterface } from "./role-interfaces";
import LayoutInterface from "@/resources/components/layout-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";

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

  getLandingPage(): string {
      return '/home';
  }

  async executeGraphqlMutation<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    const response = await httpRequest.mutate("user", {
      operation: "byGuest",
      fields: [options],
    });
    return response.byGuest;
  }

  async executeGraphqlQuery<ResponseType>(
    httpRequest: HttpRequestInterface,
    options: GraphqlBuilderOptions
  ): Promise<ResponseType> {
    const response = await httpRequest.query("user", {
      operation: "byGuest",
      fields: [options],
    });
    return response.byGuest;
  }
}

const GUEST_LAYOUT: LayoutInterface = {
  home: {
    title: "pintar-forex",
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
