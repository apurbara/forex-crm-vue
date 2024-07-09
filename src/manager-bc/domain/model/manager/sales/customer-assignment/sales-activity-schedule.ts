import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";
import { CustomerAssignmentType } from "../customer-assignment";
import { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import { SalesActivityReportType } from "./sales-activity-schedule/sales-activity-report";

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
