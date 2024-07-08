import { SalesActivityType } from "../../sales-activity";
import { CustomerAssignmentType } from "../customer-assignment";
import { SalesActivityReportType } from "./sales-activity-schedule/sales-activity-report";
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