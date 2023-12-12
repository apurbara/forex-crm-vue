import RecycleRequest, {
  RecycleRequestType,
} from "./assigned-customer/recycle-request";
import ClosingRequest, {
  ClosingRequestType,
} from "./assigned-customer/closing-request";
import Customer, { CustomerType } from "@/domain/model/customer";
import Sales, { SalesType } from "../sales";
import { PaginationResponseType } from "@/resources/components/abstract-pagination";
import SalesActivitySchedule, {
  SalesActivityScheduleType,
} from "./assigned-customer/sales-activity-schedule";
import CustomerJourney, {
  CustomerJourneyType,
} from "@/domain/model/customer-journey";
import { scheduler } from "timers/promises";

export type AssignedCustomerType = {
  id?: string;
  status?: string;
  createdTime?: string;
  sales?: SalesType;
  customer?: CustomerType;
  customerJourney?: CustomerJourneyType;
  schedules?: PaginationResponseType<SalesActivityScheduleType>;
  closingRequests?: PaginationResponseType<ClosingRequestType>;
  recycleRequests?: PaginationResponseType<RecycleRequestType>;
};

export default class AssignedCustomer {
  public salesActivitySchedules: SalesActivitySchedule[] = [];
  public closingRequests: ClosingRequest[] = [];
  public recycleRequests: RecycleRequest[] = [];

  constructor(
    public id: string = "",
    public status: string = "ACTIVE",
    public createdTime: string = "",
    public sales: Sales = new Sales(),
    public customer: Customer = new Customer(),
    public customerJourney: CustomerJourney = new CustomerJourney()
  ) {}

  load(data: AssignedCustomerType) {
    this.id = data.id ?? this.id;
    this.status = data.status ?? this.status;
    this.createdTime = data.createdTime ?? this.createdTime;
    if (data.sales) {
      this.sales.load(data.sales);
    }
    if (data.customer) {
      this.customer.load(data.customer);
    }
    if (data.customerJourney) {
      this.customerJourney.load(data.customerJourney);
    }

    if (data.schedules) {
      data.schedules.list.forEach((scheduleData) => {
        const schedule = new SalesActivitySchedule(this);
        schedule.load(scheduleData);
        this.salesActivitySchedules.push(schedule);
      });
    }

    if (data.closingRequests) {
      data.closingRequests.list.forEach((closingRequestData) => {
        const closingRequest = new ClosingRequest(this);
        closingRequest.load(closingRequestData);
        this.closingRequests.push(closingRequest);
      });
    }

    if (data.recycleRequests) {
      data.recycleRequests.list.forEach((recycleRequestData) => {
        const recycleRequest = new RecycleRequest(this);
        recycleRequest.load(recycleRequestData);
        this.recycleRequests.push(recycleRequest);
      });
    }
  }

  addClosingRequest(closingRequest: ClosingRequest) {
    this.closingRequests.push(closingRequest);
  }
  
  addRecycleRequest(recycleRequest: RecycleRequest) {
    this.recycleRequests.push(recycleRequest);
  }

  //
  completedSchedules(): SalesActivitySchedule[] {
    return this.salesActivitySchedules.filter(
      (schedule: SalesActivitySchedule) => schedule.status == "COMPLETED"
    );
  }
  upcomingSchedules(): SalesActivitySchedule[] {
    return this.salesActivitySchedules.filter(
      (schedule: SalesActivitySchedule) =>
        schedule.status == "SCHEDULED" &&
        Date.parse(schedule.endTime) > Date.now()
    );
  }
  pastSchedulesWithoutReport(): SalesActivitySchedule[] {
    return this.salesActivitySchedules.filter(
      (schedule: SalesActivitySchedule) =>
        schedule.status == "SCHEDULED" &&
        Date.parse(schedule.endTime) < Date.now()
    );
  }
  activeClosingRequest() {
    return this.closingRequests.filter(
      (request: ClosingRequest) => request.status == "WAITING_FOR_APPROVAL"
    );
  }
  activeRecycleRequest() {
    return this.recycleRequests.filter(
      (request: RecycleRequest) => request.status == "WAITING_FOR_APPROVAL"
    );
  }
  completedClosingRequest() {
    return this.closingRequests.filter(
      (request: ClosingRequest) => request.status != "WAITING_FOR_APPROVAL"
    );
  }
  completedRecycleRequest() {
    return this.recycleRequests.filter(
      (request: RecycleRequest) => request.status != "WAITING_FOR_APPROVAL"
    );
  }

  canSubmitNewSchedulePlan(): boolean {
    return (
      this.activeClosingRequest().length < 1 &&
      this.activeRecycleRequest().length < 1 &&
      this.pastSchedulesWithoutReport().length < 1 &&
      this.upcomingSchedules().length < 1
    );
  }

  planNewSchedule(): SalesActivitySchedule {
    return new SalesActivitySchedule(this);
  }
}
