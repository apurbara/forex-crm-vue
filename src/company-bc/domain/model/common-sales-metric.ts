import { isNotEmpty, isNumber } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types"
import { EvaluationType } from "@/shared-bc/domain/enum/evaluation-type";
import { MetricType } from "@/shared-bc/domain/enum/metric-type";
import { RecurrenceType } from "@/shared-bc/domain/enum/recurrence-type";

export type CommonSalesMetricType = {
    id?: string;
    disabled?: boolean;
    createdTime?: string;
    lastModifiedTime?: string;
    name?: string;
    target?: number;
    metricType?: MetricType;
    evaluationType?: EvaluationType;
    recurrenceType?: RecurrenceType;
    recurrenceCount?: number;
    displaySchema?: string;
}

export default class CommonSalesMetric {
    id?: string = undefined;
    disabled?: boolean = undefined;
    createdTime?: string = undefined;
    lastModifiedTime?: string = undefined;
    name?: string = undefined;
    target: number = 0;
    metricType?: MetricType = undefined;
    evaluationType?: EvaluationType = undefined;
    recurrenceType?: RecurrenceType = undefined;
    recurrenceCount?: number = undefined;
    displaySchema?: string = undefined;

    constructor(data: CommonSalesMetricType = {}) {
        this.load(data);
    }

    load(data: CommonSalesMetricType) {
        this.id = data.id ?? this.id;
        this.disabled = data.disabled ?? this.disabled;
        this.createdTime = data.createdTime ?? this.createdTime;
        this.lastModifiedTime = data.lastModifiedTime ?? this.lastModifiedTime;
        this.name = data.name ?? this.name;
        this.target = data.target ?? this.target;
        this.metricType = data.metricType ?? this.metricType;
        this.evaluationType = data.evaluationType ?? this.evaluationType;
        this.recurrenceType = data.recurrenceType ?? this.recurrenceType;
        this.recurrenceCount = data.recurrenceCount ?? this.recurrenceCount;
        this.displaySchema = data.displaySchema ?? this.displaySchema;
    }

    toGraphqlVariables() {
        return {
            id: { type: "ID", value: this.id },
            name: this.name,
            target: Number(this.target),
            metricType: this.metricType,
            evaluationType: this.evaluationType,
            recurrenceType: this.recurrenceType,
            recurrenceCount: Number(this.recurrenceCount),
            displaySchema: this.displaySchema,
        };
    }

    toJson(): CommonSalesMetricType {
        return this;
    }

    //
    isValidName(): ValidationResult {
        return isNotEmpty(this.name) || "name is mandatory";
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
    isValidRecurrenceCount(): ValidationResult {
        return (isNumber(this.recurrenceCount) && isNotEmpty(this.recurrenceCount)) || "recurrence count is mandatory";
    }
    isValidProperties(): boolean {
        return this.isValidName() === true && this.isValidMetricType() === true
            && this.isValidEvaluationType() === true && this.isValidRecurrenceType() === true
            && this.isValidRecurrenceCount() === true;
    }
}