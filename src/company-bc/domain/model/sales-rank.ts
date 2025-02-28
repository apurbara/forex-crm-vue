import { isNotEmpty, isNumber } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types"
import { EvaluationType } from "@/shared-bc/domain/enum/evaluation-type";
import { MetricType } from "@/shared-bc/domain/enum/metric-type";
import { QueryOrderType } from "@/shared-bc/domain/enum/query-order";
import { RecurrenceType } from "@/shared-bc/domain/enum/recurrence-type";

export type SalesRankType = {
    id?: string;
    disabled?: boolean;
    createdTime?: string;
    lastModifiedTime?: string;
    name?: string;
    metricType?: MetricType;
    evaluationType?: EvaluationType;
    recurrenceType?: RecurrenceType;
    displaySalesNumber?: number;
    queryOrder?: QueryOrderType;
    displaySchema?: string;
}

export default class SalesRank {
    id?: string = undefined;
    disabled?: boolean = undefined;
    createdTime?: string = undefined;
    lastModifiedTime?: string = undefined;
    name?: string = undefined;
    displaySalesNumber?: number = undefined;
    metricType?: MetricType = undefined;
    evaluationType?: EvaluationType = undefined;
    recurrenceType?: RecurrenceType = undefined;
    queryOrder?: QueryOrderType = undefined;
    displaySchema?: string = undefined;

    constructor(data: SalesRankType = {}) {
        this.load(data);
    }

    load(data: SalesRankType) {
        this.id = data.id ?? this.id;
        this.disabled = data.disabled ?? this.disabled;
        this.createdTime = data.createdTime ?? this.createdTime;
        this.lastModifiedTime = data.lastModifiedTime ?? this.lastModifiedTime;
        this.name = data.name ?? this.name;
        this.displaySalesNumber = data.displaySalesNumber ?? this.displaySalesNumber;
        this.metricType = data.metricType ?? this.metricType;
        this.evaluationType = data.evaluationType ?? this.evaluationType;
        this.recurrenceType = data.recurrenceType ?? this.recurrenceType;
        this.queryOrder = data.queryOrder ?? this.queryOrder;
        this.displaySchema = data.displaySchema ?? this.displaySchema;
    }

    toGraphqlVariables() {
        return {
            id: { type: "ID", value: this.id },
            name: this.name,
            displaySalesNumber: Number(this.displaySalesNumber),
            metricType: this.metricType,
            evaluationType: this.evaluationType,
            recurrenceType: this.recurrenceType,
            queryOrder: this.queryOrder,
            displaySchema: this.displaySchema,
        };
    }

    toJson(): SalesRankType {
        return this;
    }

    //
    isValidName(): ValidationResult {
        return isNotEmpty(this.name) || "name is mandatory";
    }
    isValidDisplaySalesNumber(): ValidationResult {
        return (isNotEmpty(this.displaySalesNumber) && isNumber(this.displaySalesNumber)) || "display sales number is mandatory";
    }
    isValidMetricType(): ValidationResult {
        return isNotEmpty(this.metricType) || "metric type is mandatory";
    }
    isValidEvaluationType(): ValidationResult {
        return isNotEmpty(this.evaluationType) || "evaluation type is mandatory";
    }
    isValidRecurrenceType(): ValidationResult {
        return isNotEmpty(this.recurrenceType) || "recurrence type is mandatory";
    }
    isValidQueryOrder(): ValidationResult {
        return isNotEmpty(this.queryOrder) || "query order is mandatory";
    }
    isValidProperties(): boolean {
        return this.isValidName() === true && this.isValidMetricType() === true
            && this.isValidEvaluationType() === true && this.isValidRecurrenceType() === true
            && this.isValidQueryOrder() === true
            && this.isValidDisplaySalesNumber() === true;
    }
}