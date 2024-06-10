import { LabelType } from "@/shared-bc/domain/value-object/label";

export type AreaType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
} & LabelType