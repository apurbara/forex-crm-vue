import { LabelType } from "@/shared-bc/domain/value-object/label";

export type SalesActivityType = {
  id?: string;
  createdTime?: string;
  disabled?: boolean;
  duration?: number;
  initial?: boolean;
} & LabelType