import { ValidationResult } from "@/resources/types/custom-types";
import SalesActivitySchedule, { SalesActivityScheduleType } from "../sales-activity-schedule";
import { isNotEmpty } from "@/resources/composables/validator";

export type SalesActivityReportType = {
  id?: string;
  submitTime?: string;
  content?: string;
  //
  SalesActivitySchedule_id?: string;
  salesActivitySchedule?: SalesActivityScheduleType;
};

export default class SalesActivityReport {
  id?: string;
  submitTime?: string;
  content?: string;
  //
  salesActivitySchedule?: SalesActivitySchedule;
  constructor(data: SalesActivityReportType = {}) {
    this.load(data);
  }

  load(data: SalesActivityReportType) {
    this.id = data.id ?? this.id;
    this.submitTime = data.submitTime ?? this.submitTime;
    this.content = data.content ?? this.content;

    if (data.salesActivitySchedule) {
      this.salesActivitySchedule ??= new SalesActivitySchedule();
      this.salesActivitySchedule.load(data.salesActivitySchedule);
    }
  }

  toGraphqlVariables() {
    return {
      content: this.content,
    };
  }

  //
  isValidContent(): ValidationResult {
    return isNotEmpty(this.content) || "report content is mandatory";
  }

  isValidToSubmit() {
    return this.isValidContent() === true;
  }
}
