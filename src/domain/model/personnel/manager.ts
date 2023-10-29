import {
  OptionalBoolean,
  OptionalString,
} from "@/resources/types/custom-types";
import Personnel, { PersonnelType } from "../personnel";

export type ManagerType = {
  id: OptionalString;
  disabled: OptionalBoolean;
  createdTime: OptionalString;
  personnel?: PersonnelType;
};

export default class Manager {
  public personnel?: Personnel;

  constructor(
    public id: string = "",
    public disabled: boolean = false,
    public createdTime: string = ""
  ) {}

  load(data: ManagerType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;

    if (data.personnel) {
      if (!this.personnel) {
        this.personnel = new Personnel();
      }
      this.personnel?.load(data.personnel);
    }
  }
}
