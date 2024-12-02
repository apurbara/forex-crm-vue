import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";
import { CustomerAssignmentType } from "../customer-assignment";
import { SalesActivityType } from "../../../sales-activity";
import { SalesActivityReportType } from "./sales-activity-schedule/sales-activity-report";
import { GreetingAssignmentType } from "../greeting-assignment";
import { FactFindingAssignmentType } from "../fact-finding-assignment";
import { StrikingAssignmentType } from "../striking-assignment";

export type SalesActivityScheduleType = {
  id?: string;
  status?: SalesActivityScheduleStatus;
  createdTime?: string;
  startTime?: string;
  endTime?: string;
  //
  GreetingAssignment_id?: string;
  greetingAssignment?: GreetingAssignmentType;
  //
  FactFindingAssignment_id?: string;
  factFindingAssignment?: FactFindingAssignmentType;
  //
  StrikingAssignment_id?: string;
  strikingAssignment?: StrikingAssignmentType;
  //
  SalesActivity_id?: string;
  salesActivity?: SalesActivityType;
  //
  salesActivityReport?: SalesActivityReportType;
};
