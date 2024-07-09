import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";
import { isNotEmpty } from "@/resources/composables/validator";
import CustomerAssignment, {
  CustomerAssignmentType,
} from "../customer-assignment";
import SalesActivityReport, {
  SalesActivityReportType,
} from "./sales-activity-schedule/sales-activity-report";
import { SalesActivityType } from "@/company-bc/domain/model/sales-activity";

export type SalesActivityScheduleSummaryType = {
  total?: number;
  status?: string;
  startTime?: string;
  endTime?: string;
};

export type SalesActivityScheduleType = {
  CustomerAssignment_id?: string;
  customerAssignment?: CustomerAssignmentType;
  //
  id?: string;
  createdTime?: string;
  status?: SalesActivityScheduleStatus;
  startTime?: string;
  endTime?: string;
  //
  SalesActivity_id?: string;
  salesActivity?: SalesActivityType;
  //
  salesActivityReport?: SalesActivityReportType;
  //
};

export default class SalesActivitySchedule {
  customerAssignment?: CustomerAssignment;
  id?: string;
  createdTime?: string;
  status?: SalesActivityScheduleStatus;
  startTime?: string;
  endTime?: string;
  salesActivity?: SalesActivityType;
  salesActivityReport?: SalesActivityReport;

  constructor(data: SalesActivityScheduleType = {}) {}
  load(data: SalesActivityScheduleType) {
    if (data.customerAssignment) {
      this.customerAssignment ??= new CustomerAssignment();
      this.customerAssignment.load(data.customerAssignment);
    }

    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.status = data.status ?? this.status;
    this.startTime = data.startTime ?? this.startTime;
    this.endTime = data.endTime ?? this.endTime;
    this.salesActivity = data.salesActivity ?? this.salesActivity;

    if (data.salesActivityReport) {
      this.salesActivityReport ??= new SalesActivityReport();
      this.salesActivityReport.load(data.salesActivityReport);
    }
  }

  //
  toGraphqlVariables() {
    return {
      SalesActivity_id: {
        type: "ID",
        required: true,
        value: this.salesActivity?.id,
      },
      startTime: { value: this.startTime, type: "DateTimeZ" },
    };
  }

  //
  isValidStartTime() {
    return isNotEmpty(this.startTime) || "start time is mandatory";
  }
  isValidToSubmit() {
    return (
      this.isValidStartTime() === true &&
      !!this.customerAssignment?.id &&
      !!this.salesActivity?.id
    );
  }
}
