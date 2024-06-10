import RegularException from "@/resources/exception/regular-exception";
import axios, { AxiosRequestConfig } from "axios";
import RestRequestInterface from "../rest-request-interface";

export default class AxiosRestRequest implements RestRequestInterface {
  protected axios;

  constructor() {
    this.axios = axios.create({
      baseURL: import.meta.env.VITE_VINOV_REST_API,
      timeout: 25000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }

  async get<ResponseType = {}>(url: string, queryParameters: any, token?: string): Promise<ResponseType> {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      params: queryParameters,
    }
    const response = await this.axios.get(url, config)
      .catch((error) => {
        console.log(error)
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

  async post<ResponseType = {}>(url: string, data?: any, token?: string): Promise<ResponseType> {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
    const response = await this.axios.post(url, data, config)
      .catch((error) => {
        console.log(error)
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

  async uploadFile<ResponseType = {}>(
    url: string,
    file: string | Blob,
    token: string | undefined,
    onUploadProgress: any
  ): Promise<ResponseType> {
    this.axios.defaults.baseURL = import.meta.env.VITE_VINOV_REST_API;
    const config = token
      ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
      : {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      };

    let formData = new FormData();
    formData.append("file", file);

    const response = await this.axios
      .post<ResponseType>(url, formData, config)
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

  async downloadStream(
    url: string,
    token?: string,
    params?: object,
    fileType?: string,
    label?: string
  ): Promise<void> {
    this.axios.defaults.baseURL = import.meta.env.VITE_VINOV_REST_API;
    const config = token
      ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      }
      : params
        ? { params: params }
        : undefined;
    console.log(config);
    const response = await this.axios
      .get<ResponseType>(url, config)
      .then((response) => {
        const blob = new Blob([response.data], {
          type: fileType ?? "text/csv",
        });
        const link = document.createElement("a");
        link.download = label ?? "download";
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      })
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
  }
}
