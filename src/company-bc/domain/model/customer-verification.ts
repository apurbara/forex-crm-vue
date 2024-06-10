import Label, { LabelType } from "@/shared-bc/domain/value-object/label";

export type CustomerVerificationType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  weight?: number;
  position?: number;
} & LabelType;

export default class CustomerVerification {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  weight: number = 0;
  position: number = 0;
  label: Label = new Label();

  constructor(data: CustomerVerificationType = {}) {
    this.load(data);
  }

  load(data: CustomerVerificationType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.weight = data.weight ?? this.weight;
    this.position = data.position ?? this.position;
    this.label.load(data);
  }

  toGraphqlVariables() {
    return {
      id: { type: "ID", value: this.id },
      ...this.label,
      weight: Number(this.weight),
      position: Number(this.position),
    };
  }

  isValidProperties(): boolean {
    return this.label.isValidProperties();
  }
}
