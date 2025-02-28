import AccountInfo, { AccountInfoType } from "@/shared-bc/domain/value-object/account-info";

export type AdminType = {
  id?: string;
  aSuperUser?: boolean;
  disabled?: boolean;
} & AccountInfoType;

export default class Admin {
  id?: string;
  disabled?: boolean;
  aSuperUser: boolean = false;
  accountInfo: AccountInfo = new AccountInfo();

  constructor(data: AdminType = {}) {
    this.load(data);
  }

  load(data: AdminType): void {
    this.id = data.id ?? this.id;
    this.aSuperUser = data.aSuperUser ?? this.aSuperUser;
    this.disabled = data.disabled ?? this.disabled;
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
