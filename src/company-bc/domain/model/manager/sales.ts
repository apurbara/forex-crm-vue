import AccountInfo, {
  AccountInfoType,
} from "@/shared-bc/domain/value-object/account-info";
import { ValidationResult } from "@/resources/types/custom-types";
import { isNotEmpty } from "@/resources/composables/validator";
import { SalesRoleEnum } from "@/shared-bc/domain/enum/sales-role-enum";
import { CityType } from "../province/city";
import { ManagerType } from "../manager";

export type SalesType = {
  id?: string;
  contractTerminated?: boolean;
  createdTime?: string;
  contractTerminatedTime?: string;
  role?: SalesRoleEnum;
  //
  City_id?: string;
  city?: CityType;
  //
  Manager_id?: string;
  manager?: ManagerType;
} & AccountInfoType;

export default class Sales {
  id?: string;
  contractTerminated?: boolean;
  createdTime?: string;
  contractTerminatedTime?: string;
  //
  role: SalesRoleEnum = SalesRoleEnum.GREETER;
  accountInfo: AccountInfo = new AccountInfo();
  //
  city?: CityType;
  manager?: ManagerType;

  constructor(data: SalesType = {}) {
    this.load(data);
  }

  load(data: SalesType): void {
    this.id = data.id ?? this.id;
    this.contractTerminated =
      data.contractTerminated ?? this.contractTerminated;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.contractTerminatedTime =
      data.contractTerminatedTime ?? this.contractTerminatedTime;
    this.role = data.role ?? this.role;
    this.accountInfo.load(data);
    //
    this.city = data.city ?? this.city;
    this.manager = data.manager ?? this.manager;
  }

  toGraphqlVariables() {
    return {
      ...this.accountInfo.toGraphqlVariables(),
      id: { type: "ID", value: this.id },
      role: this.role,
      City_id: { type: "ID", value: this.city?.id },
      Manager_id: { type: "ID", value: this.manager?.id },
    };
  }

  isValidRole(): ValidationResult {
    return isNotEmpty(this.role) || "sales role is mandatory";
  }

  isValidToCreate(): boolean {
    return (
      this.accountInfo.isValidToCreate() &&
      this.isValidRole() === true &&
      !!this.manager?.id
    );
  }
  isValidToUpdate(): boolean {
    return this.isValidRole() === true && !!this.manager?.id;
  }
}
