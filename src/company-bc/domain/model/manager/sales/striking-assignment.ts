import { CustomerAssignmentType } from "./customer-assignment";
import { SalesActivityScheduleType } from "./customer-assignment/sales-activity-schedule";
import { ClosingRequestType } from "./striking-assignment/closing-request";
import { CustomerJourneyType } from "../../customer-journey";

export type StrikingAssignmentType = {
  customerJourney?: CustomerJourneyType;
  salesActivitySchedules?: SalesActivityScheduleType[];
  closingRequests?: ClosingRequestType[];
} & CustomerAssignmentType;
