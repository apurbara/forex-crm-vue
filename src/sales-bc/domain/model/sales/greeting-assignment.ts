import { GreetingAssignmentType } from "@/company-bc/domain/model/manager/sales/greeting-assignment";
import CustomerAssignment from "./customer-assignment";

export default class GreetingAssignment {
  customerAssignment: CustomerAssignment = new CustomerAssignment();

  constructor(data: GreetingAssignmentType = {}) {
    this.load(data);
  }

  load(data: GreetingAssignmentType) {
    this.customerAssignment.load(data);
  }
}
