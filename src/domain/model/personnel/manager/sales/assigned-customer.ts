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

export type AssignedCustomerType = {
  id?: string;
  disabled?: boolean;
  createdTime?: string;
  sales?: SalesType;
  customer?: CustomerType;
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
    public disabled: boolean = false,
    public createdTime: string = "",
    public sales: Sales = new Sales(),
    public customer: Customer = new Customer()
  ) {}

  load(data: AssignedCustomerType) {
    this.id = data.id ?? this.id;
    this.disabled = data.disabled ?? this.disabled;
    this.createdTime = data.createdTime ?? this.createdTime;
    if (data.sales) {
      this.sales.load(data.sales);
    }
    if (data.customer) {
      this.customer.load(data.customer);
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

  planNewSchedule(): SalesActivitySchedule {
    return new SalesActivitySchedule(this);
  }
}
