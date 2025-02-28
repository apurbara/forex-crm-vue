import { isNotEmpty } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types";

export type LabelType = {
  name?: string;
  description?: string;
};

export default class Label {
  name: string = "";
  description: string = "";
  constructor(data: LabelType = {}) {
    this.load(data)
  }

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
