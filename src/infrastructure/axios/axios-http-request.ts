import RegularException from "@/resources/exception/regular-exception";
import axios, { AxiosProgressEvent } from "axios";
import { mutation, query } from "gql-query-builder";
import HttpRequestInterface from "@/domain/user-role/http-request-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";

export default class AxiosHttpRequest implements HttpRequestInterface {
  protected axios;

  constructor() {
    this.axios = axios.create({
      baseURL: import.meta.env.VITE_VINOV_GRAPHQL_API,
      timeout: 25000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }

  async mutate<ResponseType = {}>(
    context: string,
    options: GraphqlBuilderOptions,
    token: string | undefined
  ): Promise<ResponseType> {
    const authHeader = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;
    const response = await this.axios
      .post<ResponseType>(context, mutation(options), authHeader)
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

  async query<ResponseType = {}>(
    context: string,
    options: GraphqlBuilderOptions,
    token: string | undefined
  ): Promise<ResponseType> {
    const authHeader = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;
    const response = await this.axios
      .post<ResponseType>(context, query(options), authHeader)
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
