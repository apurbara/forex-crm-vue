export default interface HttpRequestInterface {
  post<ResponseType = any>(
    endPoint: string,
    data: any,
    token?: string | undefined
  ): Promise<ResponseType>;

  put<ResponseType = any>(
    endPoint: string,
    data: any,
    token?: string | undefined
  ): Promise<ResponseType>;

  patch<ResponseType = any>(
    endPoint: string,
    data: any,
    token?: string | undefined
  ): Promise<ResponseType>;

  get<ResponseType = any>(
    endPoint: string,
    token?: string | undefined,
    params?: { [key: string]: any }
  ): Promise<ResponseType>;

  delete<ResponseType = any>(
    endPoint: string,
    token?: string | undefined
  ): Promise<ResponseType>;
}
