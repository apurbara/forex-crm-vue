import { isNotEmpty } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types";
import { ProvinceType } from "../province";

export type CityType = {
  id?: string;
  disabled?: boolean;
  createdTime?: boolean;
  name?: string;
  //
  Province_id?: string;
  province?: ProvinceType;
};

export default class City {
  id?: string;
  disabled?: boolean;
  createdTime?: boolean;
  name: string = "";
  //
  province?: ProvinceType;

  constructor(data: CityType = {}) {
    this.load(data);
  }

  load(data: CityType = {}) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.name = data.name ?? this.name;
    this.province = data.province ?? this.province;
  }

  //
  toGraphqlVariables() {
    return {
      id: { type: "ID", value: this.id },
      name: this.name,
      Province_id: { type: "ID", value: this.province?.id },
    };
  }

  //
  isValidName(): ValidationResult {
    return isNotEmpty(this.name) || "city name is mandatory";
  }

  isValidEntity(): boolean {
    return this.isValidName() === true && !!this.province?.id;
  }
}
