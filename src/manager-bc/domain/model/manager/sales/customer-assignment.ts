import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import { SalesType } from "../sales";
import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { SalesActivityScheduleType } from "./customer-assignment/sales-activity-schedule";
import { ClosingRequestType } from "./customer-assignment/closing-request";
import { RecycleRequestType } from "./customer-assignment/recycle-request";
import { CustomerType } from "@/company-bc/domain/model/customer";

export type CustomerAssignmentType = {
  id?: string;
  status?: CustomerAssignmentStatus;
  createdTime?: string;
  sales?: SalesType;

  Customer_id?: string;
  customer?: CustomerType;

  CustomerJourney_id?: string;
  customerJourney?: CustomerJourneyType;

  salesActivitySchedules?: SalesActivityScheduleType[];
  closingRequests?: ClosingRequestType[];
  recycleRequests?: RecycleRequestType[];
};

