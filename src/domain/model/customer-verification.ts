import {
  OptionalBoolean,
  OptionalString,
} from "@/resources/types/custom-types";
import Label, { LabelType } from "../value-object/label";

export type CustomerVerificationType = {
  id: OptionalString;
  disabled: OptionalBoolean;
  createdTime: OptionalString;
} & LabelType;

export default class CustomerVerification {
  constructor(
    public id: OptionalString = undefined,
    public disabled: boolean = false,
    public createdTime: OptionalString = undefined,
    public label: Label = new Label()
  ) {}

  load(data: CustomerVerificationType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.label.load(data);
  }

  toGraphqlVariables() {
    return {
      ...this.label,
    };
  }

  isValidProperties(): boolean {
    return this.label.isValidProperties();
  }
}
