import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import UserRepository, { UserRole, UserRoleType } from "./user-repository";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import LayoutInterface from "@/resources/components/layout-interface";
import { baseHome, generateBaseAppBarMenuItems } from "@/shared/components/default-layout";

export default class SalesRole implements UserRole {
	protected name?: string;
	protected token: string;
	static readonly type: string = "SALES";

	constructor(parameters: UserRoleType) {
		this.name = parameters.name;
		this.token = parameters.token!;
	}

	async executeGraphqlMutation<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const fields = options instanceof Array ? options : [options];
		const response = await httpRequest.mutate<{ bySales: ResponseType }>(
			"user",
			{
				operation: "bySales",
				fields: fields,
			},
			this.token
		);
		return response.bySales;
	}

	async executeGraphqlQuery<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const fields = options instanceof Array ? options : [options];
		const response = await httpRequest.query<{ bySales: ResponseType }>(
			"user",
			{
				operation: "bySales",
				fields: fields,
			},
			this.token
		);
		return response.bySales;
	}
	//
	getLandingPage(): string {
		return "/sales-dashboard"
	}
	isAuthenticated(): boolean {
		return true;
	}
	getLayout(userRepository: UserRepository): LayoutInterface {
		// const asSuperUserNavbarMenus = this.aSuperUser
		//   ? [{ title: "admin", to: "/admin" }]
		//   : [];
		return {
			home: baseHome,
			appBarMenuItems: generateBaseAppBarMenuItems(userRepository, this.name),
			navBarMenuItems: [
				// ...asSuperUserNavbarMenus,
				{
					title: "customer assignment",
					to: "/sales-customer-assignment",
				},
				{
					title: "schedule",
					to: "/schedule",
				},
			],
		};
	}
}
