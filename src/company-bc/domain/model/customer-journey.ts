import Label, { LabelType } from "@/shared-bc/domain/value-object/label";

export type CustomerJourneyType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  initial?: boolean;
} & LabelType;

export default class CustomerJourney {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  initial: boolean = false;
  label: Label = new Label();

  constructor(data: CustomerJourneyType = {}) {
    this.load(data);
  }

  load(data: CustomerJourneyType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.initial = data.initial ?? this.initial;
    this.label.load(data);
  }

  toGraphqlVariables() {
    return {
      id: { type: "ID", value: this.id },
      ...this.label,
    };
  }

  isValidProperties(): boolean {
    return this.label.isValidProperties();
  }
}
