import { LabelType } from "@/shared-bc/domain/value-object/label";

export type CustomerVerificationType = {
  id?: string;
  createdTime?: string;
  disabled?: boolean;
  weight?: number;
  position?: number;
} & LabelType;