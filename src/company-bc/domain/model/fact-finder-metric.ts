import { isNotEmpty } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types";
import { EvaluationType } from "@/shared-bc/domain/enum/evaluation-type";
import { RecurrenceType } from "@/shared-bc/domain/enum/recurrence-type";
import { SalesMetricTypeEnum } from "@/shared-bc/domain/enum/sales-metric-type-enum";

export type FactFinderMetricType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;

  name?: string;
  target?: number;
  dailyReminderTarget?: number;
  salesMetricType?: SalesMetricTypeEnum;
  evaluationType?: EvaluationType;
  recurrenceType?: RecurrenceType;
  recurrenceCount?: number;
};

export default class FactFinderMetric {
  id?: string;
  disabled?: boolean;

  name?: string;
  target?: number;
  dailyReminderTarget?: number;
  salesMetricType?: SalesMetricTypeEnum;
  evaluationType?: EvaluationType;
  recurrenceType?: RecurrenceType;
  recurrenceCount?: number;

  constructor(data: FactFinderMetricType = {}) {
    this.load(data);
  }
  load(data: FactFinderMetricType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.name = data.name ?? this.name;
    this.target = data.target ?? this.target;
    this.salesMetricType = data.salesMetricType ?? this.salesMetricType;
    this.dailyReminderTarget = data.dailyReminderTarget ?? this.dailyReminderTarget;
    this.evaluationType = data.evaluationType ?? this.evaluationType;
    this.recurrenceType = data.recurrenceType ?? this.recurrenceType;
    this.recurrenceCount = data.recurrenceCount ?? this.recurrenceCount;
  }

  //
  validateName(): ValidationResult {
    return isNotEmpty(this.name) || "name is mandatory";
  }
  validateSalesMetricType(): ValidationResult {
    return isNotEmpty(this.salesMetricType) || "sales metric type is mandatory";
  }
  validateEvaluationType(): ValidationResult {
    return isNotEmpty(this.evaluationType) || "evaluation type is mandatory";
  }
  validateRecurrenceType(): ValidationResult {
    return isNotEmpty(this.recurrenceType) || "recurrence type is mandatory";
  }
  validateRecurrenceCount(): ValidationResult {
    return isNotEmpty(this.recurrenceCount) || "recurrence count is mandatory";
  }
  isValidFactFinderMetric(): boolean {
    return (
      this.validateName() === true &&
      this.validateSalesMetricType() === true &&
      this.validateEvaluationType() === true &&
      this.validateRecurrenceType() === true &&
      this.validateRecurrenceCount() === true
    );
  }

  //
  toGraphqlVariables() {
    return {
      id: { type: "ID", value: this.id },
      name: this.name,
      target: Number(this.target),
      salesMetricType: this.salesMetricType,
      dailyReminderTarget: this.dailyReminderTarget,
      evaluationType: this.evaluationType,
      recurrenceType: this.recurrenceType,
      recurrenceCount: Number(this.recurrenceCount),
    };
  }
}
