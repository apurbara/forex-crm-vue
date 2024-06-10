import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import Customer, { CustomerType } from "../../dependency-model/customer";
import { PaginationResponseType } from "@/resources/components/abstract-pagination";
import SalesActivitySchedule, { SalesActivityScheduleType } from "./customer-assignment/sales-activity-schedule";
import ClosingRequest, { ClosingRequestType } from "./customer-assignment/closing-request";
import RecycleRequest, { RecycleRequestType } from "./customer-assignment/recycle-request";

export type CustomerAssignmentType = {
  id?: string;
  status?: string;
  createdTime?: string;
  customer?: CustomerType;
  customerJourney?: CustomerJourneyType;
  salesActivitySchedules?: PaginationResponseType<SalesActivityScheduleType>;
  closingRequests?: PaginationResponseType<ClosingRequestType>;
  recycleRequests?: PaginationResponseType<RecycleRequestType>;
};

export default class CustomerAssignment {
  public salesActivitySchedules: SalesActivitySchedule[] = [];
  public closingRequests: ClosingRequest[] = [];
  public recycleRequests: RecycleRequest[] = [];

  constructor(
    public id: string = "",
    public status: string = "ACTIVE",
    public createdTime: string = "",
    public customer: Customer = new Customer(),
    public customerJourney?: CustomerJourneyType
  ) { }

  load(data: CustomerAssignmentType) {
    this.id = data.id ?? this.id;
    this.status = data.status ?? this.status;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.customerJourney = data.customerJourney ?? this.customerJourney;

    if (data.customer) {
      this.customer.load(data.customer);
    }
    // if (data.customerJourney) {
    //   this.customerJourney.load(data.customerJourney);
    // }

    if (data.salesActivitySchedules) {
      data.salesActivitySchedules.list.forEach((scheduleData) => {
        const schedule = new SalesActivitySchedule(this)
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
    const lastRejectedRecycleRequest = this.completedClosingRequest.length < 1 ? undefined : this.completedRecycleRequest().reduce(
      (prev, current) => {
        return prev.concludedTime > current.concludedTime ? prev : current;
      }
    );
    return this.salesActivitySchedules.filter(
      (schedule: SalesActivitySchedule) =>
        // schedule.status == "COMPLETED"
        schedule.status == "COMPLETED" &&
        new Date(schedule.startTime) >
        (lastRejectedRecycleRequest?.concludedTime ? new Date(lastRejectedRecycleRequest?.concludedTime) : -Infinity)
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

  canSubmitInitialReport(): boolean {
    return this.salesActivitySchedules.length === 0;
  }

  planNewSchedule(): SalesActivitySchedule {
    return new SalesActivitySchedule(this);
  }
}
