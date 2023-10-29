import { isNotEmpty } from "@/resources/composables/validator";
import {
  OptionalString,
  ValidationResult,
} from "@/resources/types/custom-types";

export type LabelType = {
  name: OptionalString;
  description: OptionalString;
};

export default class Label {
  constructor(
    public name: string = "",
    public description: OptionalString = undefined
  ) {}

  load(data: LabelType) {
    this.name = data.name ?? this.name;
    this.description = data.description ?? this.description;
  }

  isValidName(): ValidationResult {
    return isNotEmpty(this.name) || "name is mandatory";
  }

  isValidProperties(): boolean {
    return this.isValidName() === true;
  }
}
