import {
  OptionalBoolean,
  OptionalString,
} from "@/resources/types/custom-types";
import AccountInfo, { AccountInfoType } from "../value-object/account-info";
import Manager, { ManagerType } from "./personnel/manager";
import Pagination, {
  PaginationType,
} from "@/resources.bak/components/pagination";
import Sales, { SalesType } from "./personnel/manager/sales";

export type PersonnelType = {
  id?: string;
  disabled?: boolean;
  managerAssignments?: PaginationType<ManagerType>;
  salesAssignments?: PaginationType<SalesType>;
} & AccountInfoType;

export default class Personnel {
  public managerAssignments: Manager[] = [];
  public salesAssignments: Sales[] = [];

  constructor(
    public id: OptionalString = undefined,
    public disabled: OptionalBoolean = undefined,
    public accountInfo: AccountInfo = new AccountInfo()
  ) {}

  load(data: PersonnelType): void {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.accountInfo.load(data);

    data.managerAssignments?.list.forEach((managerData) => {
      const manager = new Manager();
      manager.load(managerData);
      this.managerAssignments.push(manager);
    });

    data.salesAssignments?.list.forEach((salesData) => {
      const sales = new Sales();
      sales.load(salesData);
      this.salesAssignments.push(sales);
    });
  }

  assignAsSales(): Sales {
    const sales = new Sales();
    sales.personnel = this;
    return sales;
  }

  //
  toGraphqlVariables() {
    return this.accountInfo.toGraphqlVariables();
  }

  //
  isValidToCreate(): boolean {
    return this.accountInfo.isValidToCreate();
  }
}
