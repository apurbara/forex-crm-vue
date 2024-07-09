import { isNotEmpty } from "@/resources/composables/validator";
import SalesActivity, { SalesActivityType } from "../../sales-activity";
import CustomerAssignment, {
  CustomerAssignmentType,
} from "../customer-assignment";
import SalesActivityReport, {
  SalesActivityReportType,
} from "./sales-activity-schedule/sales-activity-report";
import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";

export type SalesActivityScheduleType = {
  id?: string;
  status?: SalesActivityScheduleStatus;
  createdTime?: string;
  startTime?: string;
  endTime?: string;
  //
  CustomerAssignment_id?: string;
  customerAssignment?: CustomerAssignmentType;
  SalesActivity_id?: string;
  salesActivity?: SalesActivityType;
  //
  salesActivityReport?: SalesActivityReportType;
};

export type SalesActivityScheduleSummaryType = {
  total?: number;
  status?: string;
  startTime?: string;
  endTime?: string;
};

export default class SalesActivitySchedule {
  id?: string;
  createdTime?: string;
  startTime?: string;
  endTime?: string;
  status?: SalesActivityScheduleStatus;
  //
  customerAssignment?: CustomerAssignment;
  salesActivity?: SalesActivity;
  //
  salesActivityReport?: SalesActivityReport;

  constructor(data: SalesActivityScheduleType = {}) {
    this.load(data);
  }

  load(data: SalesActivityScheduleType) {
    this.id = data.id ?? this.id;
    this.status = data.status ?? this.status;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.startTime = data.startTime ?? this.startTime;
    this.endTime = data.endTime ?? this.endTime;
    if (data.customerAssignment) {
      this.customerAssignment ??= new CustomerAssignment();
      this.customerAssignment.load(data.customerAssignment);
    }
    if (data.salesActivity) {
      this.salesActivity ??= new SalesActivity();
      this.salesActivity.load(data.salesActivity);
    }
    if (data.salesActivityReport) {
      this.salesActivityReport ??= new SalesActivityReport();
      this.salesActivityReport.load(data.salesActivityReport);
    }
  }

  selectSalesActity(salesActivityData: SalesActivityType) {
    this.salesActivity ??= new SalesActivity();
    this.salesActivity.load(salesActivityData);
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
    return this.isValidStartTime() === true && !!this.salesActivity?.id;
  }
}
