import { isNotEmpty, isNumber } from "@/resources/composables/validator";
import { ValidationResult } from "@/resources/types/custom-types"
import { EvaluationType } from "@/shared-bc/domain/enum/evaluation-type";
import SalesPerformanceMetric, { SalesPerformanceMetricType } from "../sales-performance-metric";

export type SalesPerformanceMetricEvaluationType = {
	id?: string;
	removed?: boolean;
	alias?: string;
	evaluationType?: EvaluationType;
	//
	SalesPerformanceMetric_id?: string;
	salesPerformanceMetric?: SalesPerformanceMetricType;
}

export default class SalesPerformanceMetricEvaluation {
	id?: string;
	removed?: boolean;
	alias?: string;
	evaluationType?: EvaluationType;
	//
	salesPerformanceMetric?: SalesPerformanceMetric;

	constructor(data: SalesPerformanceMetricEvaluationType = {}) {
		this.load(data);
	}

	load(data: SalesPerformanceMetricEvaluationType) {
		this.id = data.id ?? this.id;
		this.removed = data.removed ?? this.removed;
		this.alias = data.alias ?? this.alias;
		this.evaluationType = data.evaluationType ?? this.evaluationType;
		if (data.salesPerformanceMetric) {
			this.salesPerformanceMetric ??= new SalesPerformanceMetric();
			this.salesPerformanceMetric.load(data.salesPerformanceMetric);
		}
	}

	toGraphqlVariables() {
		return {
			alias: this.alias,
			evaluationType: this.evaluationType,
		};
	}

	toJson(): SalesPerformanceMetricEvaluationType {
		return this;
	}

	//
	isValidAlias(): ValidationResult {
		return isNotEmpty(this.alias) || "name is mandatory";
	}
	isValidEvaluationType(): ValidationResult {
		return isNotEmpty(this.evaluationType) || "evaluation type is mandatory";
	}

	isValidProperties(): boolean {
		return this.isValidAlias() === true && this.isValidEvaluationType() === true;
	}
}