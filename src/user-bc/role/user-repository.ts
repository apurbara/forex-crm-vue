import RegularException from "@/resources/exception/regular-exception";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import AdminRole from "./admin-role";
import ManagerRole from "./manager-role";
import SalesRole from "./sales-role";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import GuestRole from "./guest-role";
import LayoutInterface from "@/resources/components/layout-interface";
import router from "@/router";

export type UserRoleType = {
	name?: string,
	token?: string,
	type?: string,
}

export interface UserRole {
	executeGraphqlMutation<ResponseType>(
		httpRequest: HttpRequestInterface,
		options: GraphqlBuilderOptions
	): Promise<ResponseType>;

	executeGraphqlQuery<ResponseType>(
		httpRequest: HttpRequestInterface,
		options: GraphqlBuilderOptions
	): Promise<ResponseType>;

	getLandingPage(): string;
	getLayout(userRepository: UserRepository): LayoutInterface;
	isAuthenticated(): boolean;
}

export default class UserRepository {
	protected user: UserRole;

	constructor() {
		const userParameters = localStorage.getItem("user");
		if (userParameters) {
			const userData: UserRoleType = JSON.parse(userParameters);
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
					this.user = new GuestRole();
					break;
			}
		} else {
			this.user = new GuestRole();
		}
	}
	//
	getUser(): UserRole {
		return this.user;
	}

	//
	logUserIn(userData: UserRoleType): void {
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
		}
		localStorage.setItem("user", JSON.stringify(userData));
		router.push(this.user.getLandingPage());
	}

	logUserOut(): void {
		this.user = new GuestRole();
		localStorage.clear();
		router.push("/");
	}
}