import { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import CustomerAssignment, { CustomerAssignmentType } from "../customer-assignment";
import SalesActivityReport, { SalesActivityReportType } from "./sales-activity-schedule/sales-activity-report";
import { isNotEmpty } from "@/resources/composables/validator";

export type SalesActivityScheduleType = {
  id?: string;
  status?: string;
  createdTime?: string;
  startTime?: string;
  endTime?: string;
  customerAssignment?: CustomerAssignmentType;
  salesActivity?: SalesActivityType;
  salesActivityReport?: SalesActivityReportType;
};

export type SalesActivityScheduleSummaryType = {
  total?: number;
  status?: string;
  startTime?: string;
  endTime?: string;
};

export default class SalesActivitySchedule {
  public salesActivityReport: SalesActivityReport = new SalesActivityReport(
    this
  );

  constructor(
    public customerAssignment: CustomerAssignment = new CustomerAssignment(),
    public salesActivity?: SalesActivityType,
    public id: string = "",
    public status: string = "SCHEDULED",
    public createdTime: string = "",
    public startTime: string = "",
    public endTime: string = ""
  ) { }

  load(data: SalesActivityScheduleType) {
    this.id = data.id ?? this.id;
    this.status = data.status ?? this.status;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.startTime = data.startTime ?? this.startTime;
    this.endTime = data.endTime ?? this.endTime;

    this.salesActivity = data.salesActivity ?? this.salesActivity;

    if (data.customerAssignment) {
      this.customerAssignment.load(data.customerAssignment);
    }
    if (data.salesActivityReport) {
      this.salesActivityReport.load(data.salesActivityReport);
    }
  }

  //
  toGraphqlVariables() {
    return {
      SalesActivity_id: { type: "ID", required: true, value: this.salesActivity?.id },
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
      !!this.customerAssignment.id &&
      !!this.salesActivity?.id
    );
  }
}
