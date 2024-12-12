import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import { SalesType } from "../sales";
import { CustomerType } from "../../customer";
import { SalesActivityScheduleType } from "./customer-assignment/sales-activity-schedule";

export type CustomerAssignmentType = {
  id?: string;
  status?: CustomerAssignmentStatus;
  createdTime?: string;
  sales?: SalesType;
  customer?: CustomerType;
  salesActivitySchedules?: SalesActivityScheduleType[];
};
