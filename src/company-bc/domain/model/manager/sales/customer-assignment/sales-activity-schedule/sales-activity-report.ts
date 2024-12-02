import { SalesActivityScheduleType } from "../sales-activity-schedule";

export type SalesActivityReportType = {
  id?: string;
  submitTime?: string;
  content?: string;
  //
  SalesActivitySchedule_id?: string;
  salesActivitySchedule?: SalesActivityScheduleType;
};
