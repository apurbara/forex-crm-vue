// import { PaginationResponseType } from "@/resources/components/abstract-pagination";
// import Customer, { CustomerType } from "../customer";
// import CustomerJourney, { CustomerJourneyType } from "../customer-journey";
// import Sales, { SalesType } from "../sales";
// import SalesActivitySchedule, { SalesActivityScheduleType } from "./customer-assignment/sales-activity-schedule";
// import ClosingRequest, { ClosingRequestType } from "./customer-assignment/closing-request";
// import RecycleRequest, { RecycleRequestType } from "./customer-assignment/recycle-request";
// import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
// import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";
// import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";

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
  // customerJourney?: CustomerJourneyType;
  salesActivitySchedules?: SalesActivityScheduleType[];
  // closingRequests?: PaginationResponseType<ClosingRequestType>;
  // recycleRequests?: PaginationResponseType<RecycleRequestType>;
};

// export default class CustomerAssignment {
//   id?: string;
//   status?: CustomerAssignmentStatus;
//   createdTime?: string;

//   sales?: Sales;
//   customer?: Customer;
//   customerJourney?: CustomerJourney;
//   salesActivitySchedules: SalesActivitySchedule[] = [];
//   closingRequests: ClosingRequest[] = [];
//   recycleRequests: RecycleRequest[] = [];

//   constructor(data: CustomerAssignmentType = {}) {
//     this.load(data);
//   }

//   load(data: CustomerAssignmentType) {
//     this.id = data.id ?? this.id;
//     this.status = data.status ?? this.status;
//     this.createdTime = data.createdTime ?? this.createdTime;
//     if (data.sales) {
//       this.sales ??= new Sales();
//       this.sales.load(data.sales);
//     }
//     if (data.customer) {
//       this.customer ??= new Customer();
//       this.customer.load(data.customer);
//     }
//     if (data.customerJourney) {
//       this.customerJourney ??= new CustomerJourney();
//       this.customerJourney.load(data.customerJourney);
//     }

//     if (data.salesActivitySchedules) {
//       data.salesActivitySchedules.list.forEach((scheduleData) => {
//         const schedule = new SalesActivitySchedule();
//         schedule.load(scheduleData);
//         this.salesActivitySchedules.push(schedule);
//       });
//     }

//     if (data.closingRequests) {
//       data.closingRequests.list.forEach((closingRequestData) => {
//         const closingRequest = new ClosingRequest();
//         closingRequest.load(closingRequestData);
//         this.closingRequests.push(closingRequest);
//       });
//     }

//     if (data.recycleRequests) {
//       data.recycleRequests.list.forEach((recycleRequestData) => {
//         const recycleRequest = new RecycleRequest();
//         recycleRequest.load(recycleRequestData);
//         this.recycleRequests.push(recycleRequest);
//       });
//     }
//   }

//   addClosingRequest(closingRequest: ClosingRequest) {
//     this.closingRequests.push(closingRequest);
//   }

//   addRecycleRequest(recycleRequest: RecycleRequest) {
//     this.recycleRequests.push(recycleRequest);
//   }

//   //
//   completedSchedules(): SalesActivitySchedule[] {
//     const lastRejectedRecycleRequest = this.completedRecycleRequest().reduce(
//       (prev, current) => {
//         return new Date(prev.concludedTime!) > new Date(current.concludedTime!) ? prev : current;
//         // return prev.concludedTime! > current.concludedTime! ? prev : current;
//       }
//     );
//     return this.salesActivitySchedules.filter(
//       (schedule: SalesActivitySchedule) =>
//         schedule.status == SalesActivityScheduleStatus.COMPLETED &&
//         new Date(schedule.startTime!) > (lastRejectedRecycleRequest.concludedTime ? (new Date(lastRejectedRecycleRequest.concludedTime)) : -Infinity)
//       // schedule.startTime >
//       // (lastRejectedRecycleRequest?.concludedTime ?? -Infinity)
//     );
//   }
//   upcomingSchedules(): SalesActivitySchedule[] {
//     return this.salesActivitySchedules.filter(
//       (schedule: SalesActivitySchedule) =>
//         schedule.status == SalesActivityScheduleStatus.SCHEDULED &&
//         Date.parse(schedule.endTime!) > Date.now()
//     );
//   }
//   pastSchedulesWithoutReport(): SalesActivitySchedule[] {
//     return this.salesActivitySchedules.filter(
//       (schedule: SalesActivitySchedule) =>
//         schedule.status == "SCHEDULED" &&
//         Date.parse(schedule.endTime!) < Date.now()
//     );
//   }
//   activeClosingRequest() {
//     return this.closingRequests.filter(
//       (request: ClosingRequest) => request.status == ManagementApprovalStatus.WAITING_FOR_APPROVAL
//     );
//   }
//   activeRecycleRequest() {
//     return this.recycleRequests.filter(
//       (request: RecycleRequest) => request.status == ManagementApprovalStatus.WAITING_FOR_APPROVAL
//     );
//   }
//   completedClosingRequest() {
//     return this.closingRequests.filter(
//       (request: ClosingRequest) => request.status != ManagementApprovalStatus.WAITING_FOR_APPROVAL
//     );
//   }
//   completedRecycleRequest() {
//     return this.recycleRequests.filter(
//       (request: RecycleRequest) => request.status != ManagementApprovalStatus.WAITING_FOR_APPROVAL
//     );
//   }

//   canSubmitNewSchedulePlan(): boolean {
//     return (
//       this.activeClosingRequest().length < 1 &&
//       this.activeRecycleRequest().length < 1 &&
//       this.pastSchedulesWithoutReport().length < 1 &&
//       this.upcomingSchedules().length < 1
//     );
//   }

//   planNewSchedule(): SalesActivitySchedule {
//     const schedule = new SalesActivitySchedule();
//     schedule.customerAssignment = this;
//     return schedule;
//   }
// }
