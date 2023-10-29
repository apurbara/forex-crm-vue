import { PersonnelType } from "./../../personnel";
import Area, { AreaType } from "../../area-structure/area";
import Personnel, { PersonnelType } from "../../personnel";
import Manager, { ManagerType } from "../manager";

export type SalesType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  type?: string;
  personnel?: PersonnelType;
  manager?: ManagerType;
  area?: AreaType;
};

export default class Sales {
  public personnel?: Personnel = new Personnel();
  public manager?: Manager = new Manager();
  public area?: Area = new Area();

  constructor(
    public id: string = "",
    public disabled: boolean = false,
    public createdTime: string = "",
    public type: string = "IN_HOUSE"
  ) {}

  load(data: SalesType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.type = data.type ?? this.type;

    this.personnel?.load(data.personnel ?? ({} as PersonnelType));
    this.manager?.load(data.manager ?? ({} as ManagerType));
    this.area?.load(data.area ?? ({} as AreaType));
  }

  isValidToSubmit(): boolean {
    return !!this.personnel?.id && !!this.manager?.id && !!this.area?.id;
  }
}
