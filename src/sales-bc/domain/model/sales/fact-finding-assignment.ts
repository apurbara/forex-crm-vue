import { FactFindingAssignmentType } from "@/company-bc/domain/model/manager/sales/fact-finding-assignment";
import CustomerAssignment from "./customer-assignment";

export default class FactFindingAssignment {
  customerAssignment: CustomerAssignment = new CustomerAssignment();

  constructor(data: FactFindingAssignmentType = {}) {
    this.load(data);
  }

  load(data: FactFindingAssignmentType) {
    this.customerAssignment.load(data);
  }
}
