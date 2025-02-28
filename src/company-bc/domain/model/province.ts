import { isNotEmpty } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types";

export type ProvinceType = {
    id?: string;
    disabled?: boolean;
    createdTime?: boolean;
    name?: string;
}

export default class Province {
    id?: string;
    disabled?: boolean;
    createdTime?: boolean;
    name: string = '';

    constructor(data: ProvinceType = {}) {
        this.load(data);
    }

    load(data: ProvinceType = {}) {
        this.id = data.id ?? this.id;
        this.disabled = data.disabled ?? this.disabled;
        this.createdTime = data.createdTime ?? this.createdTime;
        this.name = data.name ?? this.name;
    }

    //
    toGraphqlVariables() {
        return {
            name: this.name,
        };
    }

    //
    isValidName(): ValidationResult {
        return isNotEmpty(this.name) || "province name is mandatory";
    }

    isValidEntity(): boolean {
        return this.isValidName() === true;
    }
}