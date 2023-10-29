import {
  OptionalBoolean,
  OptionalNumber,
  OptionalString,
  ValidationResult,
} from "@/resources/types/custom-types";
import Label, { LabelType } from "../value-object/label";
import { isNotEmpty, isNumber } from "@/resources/composables/validator";

export type SalesActivityType = {
  id: OptionalString;
  disabled: OptionalBoolean;
  createdTime: OptionalString;
  duration: OptionalNumber;
  initial: OptionalBoolean;
} & LabelType;

export default class SalesActivity {
  constructor(
    public id: OptionalString = undefined,
    public disabled: boolean = false,
    public createdTime: OptionalString = undefined,
    public duration: number = 0,
    public initial: boolean = false,
    public label: Label = new Label()
  ) {}

  load(data: SalesActivityType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.duration = data.duration ?? this.duration;
    this.initial = data.initial ?? this.initial;
    this.label.load(data);
  }

  toGraphqlVariables() {
    return {
      duration: { type: "Int", value: +this.duration },
      ...this.label,
    };
  }

  isValidDuration(): ValidationResult {
    return (
      (isNumber(this.duration) && this.duration > 0 && this.duration <= 60) ||
      "duration in minutes is mandatory"
    );
  }

  isValidProperties(): boolean {
    return this.label.isValidProperties() && this.isValidDuration() == true;
  }
}
