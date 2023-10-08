import { ValidationResult } from "@/resources/composables/common-types";
import { isNotEmpty } from "@/resources/composables/validator";

interface LabelInterface {
  name: string;
  description?: string;
}

class Label {
  name: string;
  description?: string;
  constructor(parameters: LabelInterface = { name: "", description: "" }) {
    this.name = parameters.name;
    this.description = parameters.description;
  }

  isValidName(): ValidationResult {
    return isNotEmpty(this.name) || "name is mandatory";
  }

  isValidLabel(): boolean {
    return this.isValidName() === true;
  }
}

export { Label, LabelInterface };
