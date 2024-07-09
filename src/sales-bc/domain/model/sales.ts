import { ManagerType } from "@/company-bc/domain/model/manager";
import { CityType } from "@/company-bc/domain/model/province/city";
import { SalesEnumType } from "@/shared-bc/domain/enum/sales-enum-type";
import { AccountInfoType } from "@/shared-bc/domain/value-object/account-info";

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
