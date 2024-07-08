import RegularException from "@/resources/exception/regular-exception";
import AdminRole from "./admin-role";
import ManagerRole from "./manager-role";
import SalesRole from "./sales-role";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";
import { rollupVersion } from "vite";

export type CompanyUserRoleType = {
	token?: string;
	type?: string;
};

export interface CompanyUserRole {
	executeGraphqlMutationInCompany<ResponseType>(
		httpRequest: HttpRequestInterface,
		options: GraphqlBuilderOptions
	): Promise<ResponseType>;

	executeGraphqlQueryInCompany<ResponseType>(
		httpRequest: HttpRequestInterface,
		options: GraphqlBuilderOptions | GraphqlBuilderOptions[]
	): Promise<ResponseType>;

	executeGetRequest<ResponseType>(
		restRequest: RestRequestInterface, url: string, queryParameters?: any
	): Promise<ResponseType>

	executePostRequest<ResponseType>(
		restRequest: RestRequestInterface, url: string, data?: any
	): Promise<ResponseType>

	canAccessCompanyMenu(menu: string): boolean;
}

export default class CompanyUserRepository {
	protected user?: CompanyUserRole;

	constructor() {
		const userParameters = localStorage.getItem("user");
		if (userParameters) {
			const userData: CompanyUserRoleType = JSON.parse(userParameters);
			this.logUserIn(userData);
		}
	}
	//
	getUser<Role extends CompanyUserRole = CompanyUserRole>(): Role {
		if (!this.user) {
			throw RegularException.unauthorized('you must login to access this resources');
		}
		return this.user as Role;
	}

	//
	logUserIn(userData: CompanyUserRoleType): void {
		switch (userData.type) {
			case AdminRole.type:
				this.user = new AdminRole(userData);
				break;
			case ManagerRole.type:
				this.user = new ManagerRole(userData);
				break;
			case SalesRole.type:
				this.user = new SalesRole(userData);
				break;
			default:
				break;
		}
	}

	logUserOut(): void {
		this.user = undefined;
	}
}