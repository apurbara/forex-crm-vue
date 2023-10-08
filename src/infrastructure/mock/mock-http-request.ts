import HttpRequestInterface from "@/domain/http-request-interface";

const DATA_MAP: { [key: string]: string } = {
  "/admin-login": import.meta.env.BASE_URL + "public/data/login-response.js",
  "/manager-login": import.meta.env.BASE_URL + "public/data/login-response.js",
  "/sales-login": import.meta.env.BASE_URL + "public/data/login-response.js",
  "/manager": import.meta.env.BASE_URL + "public/data/manager.js",
  "/sales": import.meta.env.BASE_URL + "public/data/sales.js",
  "/admin": import.meta.env.BASE_URL + "public/data/admin.js",
  "/product": import.meta.env.BASE_URL + "public/data/product.js",
  "/mail-content": import.meta.env.BASE_URL + "public/data/mail-content.js",
  "/sales-activity": import.meta.env.BASE_URL + "public/data/sales-activity.js",
  "/article": import.meta.env.BASE_URL + "public/data/article.js",
  "/sales-summary": import.meta.env.BASE_URL + "public/data/sales-summary.js",
  "/customer-summary": import.meta.env.BASE_URL + "public/data/customer-summary.js",
};
export default class MockHttpRequest implements HttpRequestInterface {
  async post<ResponseType = any>(
    endPoint: string,
    data: any,
    token?: string | undefined
  ): Promise<ResponseType> {
    return fetch(DATA_MAP[endPoint])
      .then((res) => res.json())
      .then((d) => d.data.list[0]);
  }

  async put<ResponseType = any>(
    endPoint: string,
    data: any,
    token?: string | undefined
  ): Promise<ResponseType> {
    return fetch(DATA_MAP[endPoint])
      .then((res) => res.json())
      .then((d) => d.data.list[0]);
  }

  async patch<ResponseType = any>(
    endPoint: string,
    data: any,
    token?: string | undefined
  ): Promise<ResponseType> {
    return fetch(DATA_MAP[endPoint])
      .then((res) => res.json())
      .then((d) => d.data.list[0]);
  }

  async delete<ResponseType = any>(
    endPoint: string,
    token?: string | undefined
  ): Promise<ResponseType> {
    return fetch(DATA_MAP[endPoint])
      .then((res) => res.json())
      .then((d) => d.data.list[0]);
  }

  async get<ResponseType = any>(
    endPoint: string,
    token?: string | undefined
  ): Promise<ResponseType> {
    const node = "/" + endPoint.split("/")[1];
    return fetch(DATA_MAP[node])
      .then((res) => res.json())
      .then((d) => d.data);
  }
}
