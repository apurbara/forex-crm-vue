import HttpRequestInterface from "@/domain/http-request-interface";
import RegularException from "@/resources/exception/regular-exception";
import axios from "axios";

export default class AxiosHttpRequest implements HttpRequestInterface {
  protected axios;

  constructor() {
    this.axios = axios.create({
      baseURL: import.meta.env.VITE_REST_API,
      timeout: 25000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }

  private generateAuthHeader(token?: string): Object | undefined {
    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;
  }

  async post<ResponseType = any>(
    endPoint: string,
    data: any,
    token?: string | undefined
  ): Promise<ResponseType> {
    const response = await this.axios
      .post<ResponseType>(endPoint, data, this.generateAuthHeader(token))
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          throw new RegularException(
            error.response.status,
            error.response.statusText,
            error.response.errors[0]
          );
        } else {
          throw error;
        }
      });
    return response.data;
  }

  async put<ResponseType = any>(
    endPoint: string,
    data: any,
    token?: string | undefined
  ): Promise<ResponseType> {
    const response = await this.axios
      .put<ResponseType>(endPoint, data, this.generateAuthHeader(token))
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          throw new RegularException(
            error.response.status,
            error.response.statusText,
            error.response.errors[0]
          );
        } else {
          throw error;
        }
      });
    return response.data;
  }

  async patch<ResponseType = any>(
    endPoint: string,
    data: any,
    token?: string | undefined
  ): Promise<ResponseType> {
    const response = await this.axios
      .patch<ResponseType>(endPoint, data, this.generateAuthHeader(token))
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          throw new RegularException(
            error.response.status,
            error.response.statusText,
            error.response.errors[0]
          );
        } else {
          throw error;
        }
      });
    return response.data;
  }

  async delete<ResponseType = any>(
    endPoint: string,
    token?: string | undefined
  ): Promise<ResponseType> {
    const response = await this.axios
      .delete<ResponseType>(endPoint, this.generateAuthHeader(token))
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          throw new RegularException(
            error.response.status,
            error.response.statusText,
            error.response.errors[0]
          );
        } else {
          throw error;
        }
      });
    return response.data;
  }

  async get<ResponseType = any>(
    endPoint: string,
    token?: string | undefined,
    params?: { [key: string]: any }
  ): Promise<ResponseType> {
    const config = {
      params: params,
      ...this.generateAuthHeader(token),
    };
    const response = await this.axios
      .get<ResponseType>(endPoint, config)
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          throw new RegularException(
            error.response.status,
            error.response.statusText,
            error.response.errors[0]
          );
        } else {
          throw error;
        }
      });
    return response.data;
  }
}
