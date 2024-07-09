import { AccountInfoType } from "@/shared-bc/domain/value-object/account-info";

export type ManagerType = {
  id?: string;
  suspended?: boolean;
  createdTime?: string;
} & AccountInfoType;
