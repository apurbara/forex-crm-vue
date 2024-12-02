import { CustomerAssignmentStatus } from "@/shared-bc/domain/enum/customer-assignment-status";
import Customer from "./customer-assignment/customer";
import SalesActivitySchedule from "./customer-assignment/salesActivitySchedule";
import { CustomerAssignmentType } from "@/company-bc/domain/model/manager/sales/customer-assignment";
import { SalesActivityScheduleType } from "@/company-bc/domain/model/manager/sales/customer-assignment/sales-activity-schedule";

export default class CustomerAssignment {
  id?: string;
  createdTime?: string;
  status?: CustomerAssignmentStatus;
  customer: Customer = new Customer();
  salesActivitySchedules: SalesActivitySchedule[] = [];

  constructor(data: CustomerAssignmentType = {}) {
    this.load(data);
  }

  load(data: CustomerAssignmentType) {
    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.status = data.status ?? this.status;
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
  }
}
