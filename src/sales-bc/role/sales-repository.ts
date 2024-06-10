import SalesRole, { SalesRoleType } from "./sales-role";
import RegularException from "@/resources/exception/regular-exception";

export default class SalesRepository {
	protected user?: SalesRole;

	constructor() {
		const userParameters = localStorage.getItem("user");
		if (userParameters) {
			const userData: SalesRoleType = JSON.parse(userParameters);
			this.logUserIn(userData);
		}
	}
	//
	getUser(): SalesRole {
		if (!this.user) {
			throw RegularException.unauthorized('you must login to access this resources');
		}
		return this.user;
	}

	//
	logUserIn(userData: SalesRoleType): void {
		switch (userData.type) {
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