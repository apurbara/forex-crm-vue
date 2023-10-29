import {
  OptionalBoolean,
  OptionalString,
} from "@/resources/types/custom-types";
import AccountInfo, { AccountInfoType } from "../value-object/account-info";

export type AdminType = {
  id: string;
  aSuperUser: boolean;
  disabled: boolean;
} & AccountInfoType;

export default class Admin {
  constructor(
    public id: OptionalString = undefined,
    public aSuperUser: boolean = false,
    public disabled: OptionalBoolean = undefined,
    public accountInfo: AccountInfo = new AccountInfo()
  ) {}

  load(data: AdminType): void {
    this.id = data.id;
    this.aSuperUser = data.aSuperUser;
    this.disabled = data.disabled;
    this.accountInfo.load(data);
  }

  toGraphqlVariables() {
    return {
      aSuperUser: this.aSuperUser,
      ...this.accountInfo.toGraphqlVariables(),
    };
  }

  //
  isValidToCreate(): boolean {
    return this.accountInfo.isValidToCreate();
  }
}
