import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";

export type SalesRoleType = {
	token?: string;
	type?: string;
};

export default class SalesRole {
	protected token: string;
	static readonly type: string = "SALES";

	constructor(parameters: SalesRoleType) {
		this.token = parameters.token!;
	}

	async executeSalesGraphqlMutation<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions | GraphqlBuilderOptions[]
	): Promise<ResponseType> {
		const response = httpRequest.mutate("sales", options, this.token);
		return response;
	}

	async executeSalesGraphqlQuery<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions | GraphqlBuilderOptions[]
	): Promise<ResponseType> {
		const response = httpRequest.query("sales", options, this.token);
		return response;
	}
	//
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
}
