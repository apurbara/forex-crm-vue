import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import UserRepository, { UserRole, UserRoleType } from "./user-repository";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import { baseHome, generateBaseAppBarMenuItems } from "@/shared/components/default-layout";
import LayoutInterface from "@/resources/components/layout-interface";

export type AdminRoleType = {
	aSuperUser?: boolean
} & UserRoleType

export default class AdminRole implements UserRole {
	protected name?: string;
	protected token: string;
	protected aSuperUser: boolean;
	static readonly type: string = "ADMIN";

	constructor(parameters: AdminRoleType) {
		this.name = parameters.name;
		this.token = parameters.token!;
		this.aSuperUser = parameters.aSuperUser ?? false;
	}

	async executeGraphqlMutation<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const fields = options instanceof Array ? options : [options];
		const response = await httpRequest.mutate<{ byAdmin: ResponseType }>(
			"user",
			{
				operation: "byAdmin",
				fields: fields,
			},
			this.token
		);
		return response.byAdmin;
	}

	async executeGraphqlQuery<ResponseType>(
		httpRequest: HttpRequestInterface, options: GraphqlBuilderOptions
	): Promise<ResponseType> {
		const fields = options instanceof Array ? options : [options];
		const response = await httpRequest.query<{ byAdmin: ResponseType }>(
			"user",
			{
				operation: "byAdmin",
				fields: fields,
			},
			this.token
		);
		return response.byAdmin;
	}
	//
	getLandingPage(): string {
		return "/admin-dashboard"
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
					title: "common sales metric",
					to: "/common-sales-metric",
				},
				{
					title: "company metric",
					to: "/company-metric",
				},
				{
					title: "sales rank",
					to: "/sales-rank",
				},
				{
					title: "sales performance metric",
					to: "/sales-performance-metric",
				},
				{
					title: "customer journey",
					to: "/customer-journey",
				},
				{
					title: "customer verification",
					to: "/customer-verification",
				},
				{
					title: "manager",
					to: "/manager",
				},
				{
					title: "sales",
					to: "/sales",
				},
				{
					title: "sales activity",
					to: "/sales-activity",
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
