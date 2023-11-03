import { LoginAuthInfo } from "./../../../../../user-role/login-payload";
import SalesActivity, {
  SalesActivityType,
} from "@/domain/model/sales-activity";
import AssignedCustomer, { AssignedCustomerType } from "../assigned-customer";
import { isNotEmpty } from "@/resources/composables/validator";
import SalesActivityReport, {
  SalesActivityReportType,
} from "./sales-activity-schedule/sales-activity-report";

export type SalesActivityScheduleType = {
  id?: string;
  status?: string;
  createdTime?: string;
  startTime?: string;
  endTime?: string;
  assignedCustomer?: AssignedCustomerType;
  salesActivity?: SalesActivityType;
  salesActivityReport?: SalesActivityReportType;
};

export default class SalesActivitySchedule {
  public salesActivityReport: SalesActivityReport = new SalesActivityReport(
    this
  );

  constructor(
    public assignedCustomer: AssignedCustomer = new AssignedCustomer(),
    public salesActivity: SalesActivity = new SalesActivity(),
    public id: string = "",
    public status: string = "SCHEDULED",
    public createdTime: string = "",
    public startTime: string = "",
    public endTime: string = ""
  ) {}

  load(data: SalesActivityScheduleType) {
    this.id = data.id ?? this.id;
    this.status = data.status ?? this.status;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.startTime = data.startTime ?? this.startTime;
    this.endTime = data.endTime ?? this.endTime;
    if (data.assignedCustomer) {
      this.assignedCustomer.load(data.assignedCustomer);
    }
    if (data.salesActivity) {
      this.salesActivity.load(data.salesActivity);
    }
    if (data.salesActivityReport) {
      this.salesActivityReport.load(data.salesActivityReport);
    }
  }

  selectSalesActity(salesActivityData: SalesActivityType) {
    this.salesActivity.load(salesActivityData);
  }

  //
  toGraphqlVariables() {
    return {
      salesActivityId: {
        type: "ID",
        required: true,
        value: this.salesActivity.id,
      },
      startTime: { value: this.startTime, type: "DateTimeZ" },
    };
  }

  //
  isValidStartTime() {
    return isNotEmpty(this.startTime) || "start time is mandatory";
  }

  isValidToSubmit() {
    return (
      this.isValidStartTime() === true &&
      !!this.assignedCustomer.id &&
      !!this.salesActivity.id
    );
  }
}
