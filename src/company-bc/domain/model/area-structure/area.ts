import Label, { LabelType } from "@/shared-bc/domain/value-object/label";
import AreaStructure, { AreaStructureType } from "../area-structure";

export type AreaType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  parent?: AreaType;
  areaStructure?: AreaStructureType;
} & LabelType;

export default class Area {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  label: Label = new Label();
  areaStructure?: AreaStructure;
  parent?: Area;

  constructor(data: AreaType = {}) {
    this.load(data);
  }

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

  //
  toGraphqlVariables() {
    return {
      ...this.label,
    };
  }
  
  toJSON() {
    return {
      ...this.label,
      id: this.id,
    };
  }

  isValidProperties(): boolean {
    return this.label.isValidProperties();
  }
}
