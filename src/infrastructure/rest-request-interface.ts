export default interface RestRequestInterface {
	uploadFile<ResponseType = any>(
		url: string,
		file: string | Blob,
		token: string | undefined,
		onUploadProgress: any
	): Promise<ResponseType>;

	downloadStream(
		url: string,
		token?: string,
		params?: object,
		fileType?: string,
		label?: string
	): void;

	get<ResponseType = any>(url: string, queryParameters?: any, token?: string): Promise<ResponseType>;
	post<ResponseType = any>(url: string, data?: any, token?: string): Promise<ResponseType>;
}
