import {
  OptionalBoolean,
  OptionalString,
} from "@/resources/types/custom-types";
import Label, { LabelType } from "../value-object/label";

export type AreaStructureType = {
  id: OptionalString;
  disabled: OptionalBoolean;
  createdTime: OptionalString;
  parent?: AreaStructureType;
} & LabelType;

export default class AreaStructure {
  public parent?: AreaStructure;
  constructor(
    public id: OptionalString = undefined,
    public disabled: boolean = false,
    public createdTime: OptionalString = undefined,
    public label: Label = new Label()
  ) {}

  load(data: AreaStructureType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.label.load(data);

    if (data.parent) {
      if (!this.parent) {
        this.parent = new AreaStructure();
      }
      this.parent.load(data.parent);
    }
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
