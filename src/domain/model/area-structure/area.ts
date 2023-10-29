import {
  OptionalBoolean,
  OptionalString,
} from "@/resources/types/custom-types";
import AreaStructure, { AreaStructureType } from "../area-structure";
import Label, { LabelType } from "@/domain/value-object/label";

export type AreaType = {
  id: OptionalString;
  disabled: OptionalBoolean;
  createdTime: OptionalString;
  parent?: AreaType;
  areaStructure?: AreaStructureType;
} & LabelType;

export default class Area {
  public areaStructure?: AreaStructure;
  public parent?: Area;

  constructor(
    public id: OptionalString = undefined,
    public disabled: boolean = false,
    public createdTime: OptionalString = undefined,
    public label: Label = new Label()
  ) {}

  load(data: AreaType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.label.load(data);

    if (data.parent) {
      if (!this.parent) {
        this.parent = new Area();
      }
      this.parent.load(data.parent);
    }
    this.label.load(data);

    if (data.areaStructure) {
      if (!this.areaStructure) {
        this.areaStructure = new AreaStructure();
      }
      this.areaStructure.load(data.areaStructure);
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
