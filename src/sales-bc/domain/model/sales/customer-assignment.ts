import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import Customer, { CustomerType } from "./customer-assignment/customer";
import SalesActivitySchedule, {
  SalesActivityScheduleType,
} from "./customer-assignment/salesActivitySchedule";
import ClosingRequest, { ClosingRequestType } from "./customer-assignment/closing-request";
import RecycleRequest, { RecycleRequestType } from "./customer-assignment/recycle-request";
import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";

export type CustomerAssignmentType = {
  id?: string;
  status?: CustomerAssignmentStatus;
  createdTime?: string;
  //
  Customer_id?: string;
  customer?: CustomerType;
  //
  CustomerJourney_id?: string;
  customerJourney?: CustomerJourneyType;
  //
  salesActivitySchedules?: SalesActivityScheduleType[];
  closingRequests?: ClosingRequestType[];
  recycleRequests?: RecycleRequestType[];
};

export type ExtendedCustomerAssignmentType = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerSource?: string;
  customerJourneyName?: string;
  verificationScore?: number;
} & CustomerAssignmentType;

export default class CustomerAssignment {
  id?: string;
  status?: CustomerAssignmentStatus;
  createdTime?: string;
  //
  customerJourney: CustomerJourneyType = {};

  customer: Customer = new Customer();
  //
  salesActivitySchedules: SalesActivitySchedule[] = [];
  closingRequests: ClosingRequest[] = [];
  recycleRequests: RecycleRequest[] = [];

  constructor(data: CustomerAssignmentType = {}) {
    this.load(data);
  }

  load(data: CustomerAssignmentType) {
    this.id = data.id ?? this.id;
    this.status = data.status ?? this.status;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.customerJourney = data.customerJourney ?? this.customerJourney;

    if (data.customer) {
      this.customer ??= new Customer();
      this.customer.load(data.customer);
    }

    if (data.salesActivitySchedules) {
      data.salesActivitySchedules.forEach(
        (salesActivityScheduleData: SalesActivityScheduleType) => {
          const salesActivitySchedule = new SalesActivitySchedule();
          salesActivitySchedule.load(salesActivityScheduleData);
          salesActivitySchedule.customerAssignment = this;
          this.salesActivitySchedules.push(salesActivitySchedule);
        }
      );
    }

    if (data.closingRequests) {
      data.closingRequests.forEach((closingRequestData: ClosingRequestType) => {
        const closingRequest = new ClosingRequest();
        closingRequest.load(closingRequestData);
        closingRequest.customerAssignment = this;
        this.closingRequests.push(closingRequest);
      });
    }

    if (data.recycleRequests) {
      data.recycleRequests.forEach((recycleRequestData: RecycleRequestType) => {
        const recycleRequest = new RecycleRequest();
        recycleRequest.load(recycleRequestData);
        recycleRequest.customerAssignment = this;
        this.recycleRequests.push(recycleRequest);
      });
    }
  }

  //
  isNewAssignment() {
    return this.salesActivitySchedules.length === 0;
  }
  isIdleAssignment() {
    return (
      this.salesActivitySchedules.filter(
        (salesActivitySchedule: SalesActivitySchedule) =>
          salesActivitySchedule.status === SalesActivityScheduleStatus.SCHEDULED
      ).length === 0 &&
      this.closingRequests.filter(
        (closingRequest: ClosingRequest) =>
          closingRequest.status === ManagementApprovalStatus.WAITING_FOR_APPROVAL
      ).length === 0 &&
      this.recycleRequests.filter(
        (recycleRequest: RecycleRequest) =>
          recycleRequest.status === ManagementApprovalStatus.WAITING_FOR_APPROVAL
      ).length === 0
    );
  }
}
