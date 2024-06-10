import { LabelType } from "@/shared-bc/domain/value-object/label";

export type CustomerJourneyType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  initial?: boolean;
} & LabelType;