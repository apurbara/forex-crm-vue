import AccountInfo, { AccountInfoType } from "@/shared-bc/domain/value-object/account-info";
import Area, { AreaType } from "./area-structure/area";
import { ValidationResult } from "@/resources/types/custom-types";
import { isNotEmpty } from "@/resources/composables/validator";
import { SalesEnumType } from "@/shared-bc/domain/enum/sales-enum-type";

export type SalesType = {
  id?: string;
  cancelled?: boolean;
  createdTime?: string;
  cancelTime?: string;
  type?: SalesEnumType;
  //
  Area_id?: string;
  area?: Area;
} & AccountInfoType;

export default class Sales {
  id?: string;
  cancelled?: boolean;
  createdTime?: string;
  cancelTime?: string;
  //
  type: SalesEnumType = SalesEnumType.IN_HOUSE;
  accountInfo: AccountInfo = new AccountInfo();
  area?: Area;

  constructor(data: SalesType = {}) {
    this.load(data);
  }

  load(data: SalesType): void {
    this.id = data.id ?? this.id;
    this.cancelled = data.cancelled ?? this.cancelled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.cancelTime = data.cancelTime ?? this.cancelTime;
    this.type = data.type ?? this.type;
    this.accountInfo.load(data);

    if (data.area) {
      this.loadArea(data.area);
    }
  }

  loadArea(areaData: AreaType): void {
    if (!this.area) {
      this.area = new Area();
    }
    this.area.load(areaData);
  }

  toGraphqlVariables() {
    return {
      ...this.accountInfo.toGraphqlVariables(),
      type: this.type,
      Area_id: { type: "ID", value: this.area?.id },
    };
  }

  isValidType(): ValidationResult {
    return isNotEmpty(this.type) || "sales type is mandatory";
  }

  isValidToCreate(): boolean {
    return this.accountInfo.isValidToCreate() && this.isValidType() === true;
  }
}