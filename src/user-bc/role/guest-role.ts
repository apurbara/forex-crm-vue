import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import UserRepository, { UserRole } from "./user-repository";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import LayoutInterface from "@/resources/components/layout-interface";

export default class GuestRole implements UserRole {
	constructor() { }

	async executeGraphqlMutation<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const fields = options instanceof Array ? options : [options];
		const response = await httpRequest.mutate<{ byGuest: ResponseType }>(
			"user",
			{
				operation: "byGuest",
				fields: fields,
			},
		);
		return response.byGuest;
	}

	async executeGraphqlQuery<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const fields = options instanceof Array ? options : [options];
		const response = await httpRequest.query<{ byGuest: ResponseType }>(
			"user",
			{
				operation: "byGuest",
				fields: fields,
			},
		);
		return response.byGuest;
	}
	//
	getLandingPage(): string {
		return "/login"
	}
	isAuthenticated(): boolean {
		return false;
	}
	getLayout(userRepository: UserRepository): LayoutInterface {
		return {
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
	}
}
