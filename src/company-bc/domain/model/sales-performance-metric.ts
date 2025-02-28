import { isNotEmpty, isNumber } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types"
import { RecurrenceType } from "@/shared-bc/domain/enum/recurrence-type";
import SalesPerformanceMetricEvaluation, { SalesPerformanceMetricEvaluationType } from "./sales-performance-metric/sales-performance-metric-evaluation";
import { SalesPerformanceMetricTypeEnum } from "@/shared-bc/domain/enum/sales-performance-metric-type-enum";

export type SalesPerformanceMetricType = {
    id?: string;
    disabled?: boolean;
    createdTime?: string;
    lastModifiedTime?: string;
    name?: string;
    metricType?: SalesPerformanceMetricTypeEnum;
    recurrenceType?: RecurrenceType;
    recurrenceCount?: number;
    displaySchema?: string;
    evaluations?: SalesPerformanceMetricEvaluationType[];
}

export default class SalesPerformanceMetric {
    id?: string = undefined;
    disabled?: boolean = undefined;
    createdTime?: string = undefined;
    lastModifiedTime?: string = undefined;
    name?: string = undefined;
    metricType?: SalesPerformanceMetricTypeEnum = undefined;
    recurrenceType?: RecurrenceType = undefined;
    recurrenceCount?: number = undefined;
    displaySchema?: string = undefined;
    //
    evaluations: SalesPerformanceMetricEvaluation[] = [];

    constructor(data: SalesPerformanceMetricType = {}) {
        this.load(data);
    }

    load(data: SalesPerformanceMetricType) {
        this.id = data.id ?? this.id;
        this.disabled = data.disabled ?? this.disabled;
        this.createdTime = data.createdTime ?? this.createdTime;
        this.lastModifiedTime = data.lastModifiedTime ?? this.lastModifiedTime;
        this.name = data.name ?? this.name;
        this.metricType = data.metricType ?? this.metricType;
        this.recurrenceType = data.recurrenceType ?? this.recurrenceType;
        this.recurrenceCount = data.recurrenceCount ?? this.recurrenceCount;
        this.displaySchema = data.displaySchema ?? this.displaySchema;
        this.evaluations = [];
        (data.evaluations ?? []).forEach(evaluationData => {
            this.evaluations?.push(new SalesPerformanceMetricEvaluation(evaluationData));
        });
    }

    addEvaluation(): void {
        this.evaluations?.push(new SalesPerformanceMetricEvaluation());
    }
    removeEvaluation(evaluationToRemove: SalesPerformanceMetricEvaluation): void {
        const index = this.evaluations.findIndex((evaluation: SalesPerformanceMetricEvaluation) => evaluation === evaluationToRemove);
        if (index !== -1) {
            this.evaluations?.splice(index, 1);
        }
    }

    toGraphqlVariables() {
        const evaluations: {}[] = [];
        this.evaluations.forEach(evaluation => {
            evaluations.push(evaluation.toGraphqlVariables());
        });
        return {
            id: { type: "ID", value: this.id },
            name: this.name,
            metricType: this.metricType,
            recurrenceType: this.recurrenceType,
            recurrenceCount: Number(this.recurrenceCount),
            displaySchema: this.displaySchema,
            evaluations: { type: "[SalesPerformanceMetricEvaluationInput]", value: evaluations }
        };
    }

    toJson(): SalesPerformanceMetricType {
        return this;
    }

    //
    isValidName(): ValidationResult {
        return isNotEmpty(this.name) || "name is mandatory";
    }
    isValidMetricType(): ValidationResult {
        return isNotEmpty(this.metricType) || "metric type is mandatory";
    }
    isValidRecurrenceType(): ValidationResult {
        return isNotEmpty(this.recurrenceType) || "recurrence type is mandatory";
    }
    isValidRecurrenceCount(): ValidationResult {
        return (isNumber(this.recurrenceCount) && isNotEmpty(this.recurrenceCount)) || "recurrence count is mandatory";
    }
    isValidProperties(): boolean {
        let allEvaluationValid = false;
        this.evaluations.forEach((evaluation: SalesPerformanceMetricEvaluation) => {
            allEvaluationValid ||= evaluation.isValidProperties();
            // allEvaluationValid = allEvaluationValid || evaluation.isValidProperties();
        });
        return this.isValidName() === true && this.isValidMetricType() === true
            && this.isValidRecurrenceType() === true && this.isValidRecurrenceCount() === true
            && allEvaluationValid;
    }
}