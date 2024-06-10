import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import { CompanyUserRole, CompanyUserRoleType } from "./company-user-repository";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";

export default class ManagerRole implements CompanyUserRole {
	protected token: string;
	static readonly type: string = "MANAGER";

	constructor(parameters: CompanyUserRoleType) {
		this.token = parameters.token!;
	}

	canAccessCompanyMenu(menu: string): boolean {
		return [
			"customer",
		].includes(menu);
	}

	//
	async executeGraphqlMutationInCompany<ResponseType>(
		httpRequest: HttpRequestInterface,
		options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const response = await httpRequest.mutate("company", options, this.token);
		return response;
	}

	async executeGraphqlQueryInCompany<ResponseType>(
		httpRequest: HttpRequestInterface,
		options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const response = await httpRequest.query("company", options, this.token);
		return response;
	}

	async executeGetRequest<ResponseType>(
		restRequest: RestRequestInterface, url: string, queryParameters?: any
	): Promise<ResponseType> {
		return await restRequest.get(url, queryParameters, this.token);
	}

	async executePostRequest<ResponseType>(
		restRequest: RestRequestInterface, url: string, data?: any
	): Promise<ResponseType> {
		return await restRequest.post(url, data, this.token);
	}

	async uploadFile<ResponseType>(
		restRequest: RestRequestInterface, url: string, file: string | Blob, onUploadProgress: any
	): Promise<ResponseType> {
		const response = await restRequest.uploadFile<ResponseType>(
			url, file, this.token, onUploadProgress
		);
		return response;
	}

	async downloadStream(
		restRequest: RestRequestInterface, url: string, params?: object, fileType?: string, label?: string
	): Promise<void> {
		await restRequest.downloadStream(
			url, this.token, params, fileType, label
		);
	}

}
