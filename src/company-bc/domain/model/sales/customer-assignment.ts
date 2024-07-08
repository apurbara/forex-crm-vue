import { CustomerType } from "../customer";
import { CustomerJourneyType } from "../customer-journey";
import { SalesType } from "../sales";
import { SalesActivityScheduleType } from "./customer-assignment/sales-activity-schedule";
import { ClosingRequestType } from "./customer-assignment/closing-request";
import { RecycleRequestType } from "./customer-assignment/recycle-request";
import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";

export type CustomerAssignmentType = {
  id?: string;
  status?: CustomerAssignmentStatus;
  createdTime?: string;
  customerJourney?: CustomerJourneyType;
  sales?: SalesType;
  customer?: CustomerType;
  salesActivitySchedules?: SalesActivityScheduleType[];
  closingRequests?: ClosingRequestType[];
  recycleRequests?: RecycleRequestType[];
};