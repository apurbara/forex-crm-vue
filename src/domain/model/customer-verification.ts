import {
  OptionalBoolean,
  OptionalNumber,
  OptionalString,
} from "@/resources/types/custom-types";
import Label, { LabelType } from "../value-object/label";

export type CustomerVerificationType = {
  id: OptionalString;
  disabled: OptionalBoolean;
  createdTime: OptionalString;
  weight: OptionalNumber;
  position: OptionalNumber;
} & LabelType;

export default class CustomerVerification {
  constructor(
    public id: OptionalString = undefined,
    public disabled: boolean = false,
    public createdTime: OptionalString = undefined,
    public weight: OptionalNumber = undefined,
    public position: OptionalNumber = undefined,
    public label: Label = new Label()
  ) {}

  load(data: CustomerVerificationType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.weight = data.weight ?? this.weight;
    this.position = data.position ?? this.position;
    this.label.load(data);
  }

  toGraphqlVariables() {
    return {
      ...this.label,
      weight: Number(this.weight),
      position: Number(this.position),
    };
  }

  isValidProperties(): boolean {
    return this.label.isValidProperties();
  }
}
