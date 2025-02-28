import { isNumber } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types";
import Label, { LabelType } from "@/shared-bc/domain/value-object/label";

export type SalesActivityType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  duration?: number;
  initial?: boolean;
} & LabelType;

export default class SalesActivity {
  id?: string;
  disabled?: boolean = false;
  createdTime?: string;
  duration: number = 0;
  initial: boolean = false;
  //
  label: Label = new Label();

  constructor(data: SalesActivityType = {}) {
    this.load(data);
  }

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
      id: { type: "ID", value: this.id },
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
