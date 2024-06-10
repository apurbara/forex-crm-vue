import AccountInfo, { AccountInfoType } from "@/shared-bc/domain/value-object/account-info";

export type ManagerType = {
  id?: string;
  suspended?: boolean;
  createdTime?: string;
} & AccountInfoType;

export default class Manager {
  id?: string;
  suspended?: boolean;
  createdTime?: string;
  accountInfo: AccountInfo = new AccountInfo();

  constructor(data: ManagerType = {}) {
    this.load(data);
  }

  load(data: ManagerType): void {
    this.id = data.id ?? this.id;
    this.suspended = data.suspended ?? this.suspended;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.accountInfo.load(data);
  }

  toGraphqlVariables() {
    return {
      ...this.accountInfo.toGraphqlVariables(),
    };
  }

  isValidToCreate(): boolean {
    return this.accountInfo.isValidToCreate();
  }
}