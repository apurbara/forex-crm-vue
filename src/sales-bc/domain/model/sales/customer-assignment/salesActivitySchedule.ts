import { SalesActivityScheduleStatus } from "@/shared-bc/domain/enum/sales-activity-schedule-status";
import { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import SalesActivityReport from "./sales-activity-schedule/sales-activity-report";
import { SalesActivityScheduleType } from "@/company-bc/domain/model/manager/sales/customer-assignment/sales-activity-schedule";
import { isNotEmpty } from "@/resources/composables/validator";
import CustomerAssignment from "../customer-assignment";

export default class SalesActivitySchedule {
  customerAssignment?: CustomerAssignment;
  id?: string;
  createdTime?: string;
  status?: SalesActivityScheduleStatus;
  startTime?: string;
  endTime?: string;
  salesActivity?: SalesActivityType;
  salesActivityReport?: SalesActivityReport;

  constructor(data: SalesActivityScheduleType = {}) {
    this.load(data);
  }

  load(data: SalesActivityScheduleType) {
    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.status = data.status ?? this.status;
    this.startTime = data.startTime ?? this.startTime;
    this.endTime = data.endTime ?? this.endTime;
    this.salesActivity = data.salesActivity ?? this.salesActivity;

    if (data.salesActivityReport) {
      this.salesActivityReport ??= new SalesActivityReport();
      this.salesActivityReport.load(data.salesActivityReport);
    }
  }

  //
  toGraphqlVariables() {
    return {
      SalesActivity_id: {
        type: "ID",
        required: true,
        value: this.salesActivity?.id,
      },
      startTime: { value: this.startTime, type: "DateTimeZ" },
    };
  }

  //
  isValidStartTime() {
    return isNotEmpty(this.startTime) || "start time is mandatory";
  }
  isValidToSubmit() {
    return this.isValidStartTime() === true && !!this.salesActivity?.id;
  }
}
