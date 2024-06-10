import Label, { LabelType } from "@/shared-bc/domain/value-object/label";

export type AreaStructureType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  parent?: AreaStructureType;
} & LabelType;

export default class AreaStructure {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  label: Label = new Label();
  public parent?: AreaStructure;

  constructor(data: AreaStructureType = {}) {
    this.load(data);
  }

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
      id: { type: "ID", value: this.id },
      AreaStructure_idOfParent: { type: "ID", value: this.parent?.id },
      ...this.label,
    };
  }

  isValidProperties(): boolean {
    return this.label.isValidProperties();
  }
}
