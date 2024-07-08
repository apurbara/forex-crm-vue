import AccountInfo, {
  AccountInfoType,
} from "@/shared-bc/domain/value-object/account-info";
import { ValidationResult } from "@/resources/types/custom-types";
import { isNotEmpty } from "@/resources/composables/validator";
import { SalesEnumType } from "@/shared-bc/domain/enum/sales-enum-type";
import { ManagerType } from "./manager";
import { CityType } from "./province/city";

export type SalesType = {
  id?: string;
  contractTerminated?: boolean;
  createdTime?: string;
  contractTerminatedTime?: string;
  type?: SalesEnumType;
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
  type: SalesEnumType = SalesEnumType.IN_HOUSE;
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
    this.type = data.type ?? this.type;
    this.accountInfo.load(data);
    //
    this.city = data.city ?? this.city;
    this.manager = data.manager ?? this.manager;
  }

  toGraphqlVariables() {
    return {
      ...this.accountInfo.toGraphqlVariables(),
      id: { type: "ID", value: this.id },
      type: this.type,
      City_id: { type: "ID", value: this.city?.id },
      Manager_id: { type: "ID", value: this.manager?.id },
    };
  }

  isValidType(): ValidationResult {
    return isNotEmpty(this.type) || "sales type is mandatory";
  }

  isValidToCreate(): boolean {
    return (
      this.accountInfo.isValidToCreate() &&
      this.isValidType() === true &&
      !!this.manager?.id
    );
  }
}
