import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import UserRepository, { UserRole, UserRoleType } from "./user-repository";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import { baseHome, generateBaseAppBarMenuItems } from "@/shared/components/default-layout";
import LayoutInterface from "@/resources/components/layout-interface";

export default class ManagerRole implements UserRole {
	protected name?: string;
	protected token: string;
	static readonly type: string = "MANAGER";

	constructor(parameters: UserRoleType) {
		this.name = parameters.name;
		this.token = parameters.token!;
	}

	async executeGraphqlMutation<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const fields = options instanceof Array ? options : [options];
		const response = await httpRequest.mutate<{ byManager: ResponseType }>(
			"user",
			{
				operation: "byManager",
				fields: fields,
			},
			this.token
		);
		return response.byManager;
	}

	async executeGraphqlQuery<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const fields = options instanceof Array ? options : [options];
		const response = await httpRequest.query<{ byManager: ResponseType }>(
			"user",
			{
				operation: "byManager",
				fields: fields,
			},
			this.token
		);
		return response.byManager;
	}
	//
	getLandingPage(): string {
		return "/manager-dashboard"
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
					title: "customer",
					to: "/customer",
				},
				{
					title: "customer assignment",
					to: "/customer-assignment",
				},
				{
					title: "closing request",
					to: "/closing-request",
				},
				{
					title: "recycle request",
					to: "/recycle-request",
				},
				// {
				// 	title: "area",
				// 	to: "/area",
				// },
				// {
				// 	title: "personnel",
				// 	to: "/personnel",
				// },
				// {
				// 	title: "manager",
				// 	to: "/manager",
				// },
				// {
				// 	title: "sales",
				// 	to: "/sales",
				// },
				// {
				// 	title: "customer verification",
				// 	to: "/customer-verification",
				// },
				// {
				// 	title: "sales activity",
				// 	to: "/sales-activity",
				// },
				// {
				// 	title: "customer journey",
				// 	to: "/customer-journey",
				// },
			],
		};
	}
}
