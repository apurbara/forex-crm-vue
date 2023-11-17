import {
  OptionalBoolean,
  OptionalString,
} from "@/resources/types/custom-types";
import Label, { LabelType } from "../value-object/label";
import { isNotEmpty, isNumber } from "@/resources/composables/validator";

export type CustomerJourneyType = {
  id: OptionalString;
  disabled: OptionalBoolean;
  createdTime: OptionalString;
  initial: OptionalBoolean;
} & LabelType;

export default class CustomerJourney {
  constructor(
    public id: OptionalString = undefined,
    public disabled: boolean = false,
    public createdTime: OptionalString = undefined,
    public initial: boolean = false,
    public label: Label = new Label()
  ) {}

  load(data: CustomerJourneyType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.initial = data.initial ?? this.initial;
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
