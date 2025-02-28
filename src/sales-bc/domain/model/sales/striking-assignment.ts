import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { StrikingAssignmentType } from "@/company-bc/domain/model/manager/sales/striking-assignment";
import ClosingRequest from "./striking-assignment/closing-request";
import CustomerAssignment from "./customer-assignment";
import { ClosingRequestType } from "@/company-bc/domain/model/manager/sales/striking-assignment/closing-request";
import { ManagementApprovalStatus } from "@/shared-bc/domain/enum/management-approval-status";

export default class StrikingAssignment {
  customerAssignment: CustomerAssignment = new CustomerAssignment();
  customerJourney: CustomerJourneyType = {};
  closingRequests: ClosingRequest[] = [];

  constructor(data: StrikingAssignmentType = {}) {
    this.load(data);
  }

  load(data: StrikingAssignmentType) {
    this.customerAssignment.load(data);
    this.customerJourney = data.customerJourney ?? this.customerJourney;
    if (data.closingRequests) {
      data.closingRequests.forEach((closingRequestData: ClosingRequestType) => {
        const closingRequest = new ClosingRequest();
        closingRequest.load(closingRequestData);
        closingRequest.strikingAssignment = this;
        this.closingRequests.push(closingRequest);
      });
    }
  }

  hasActiveClosingRequest(): boolean {
    return this.closingRequests.some(
      (closingRequest) =>
        closingRequest.status === ManagementApprovalStatus.WAITING_FOR_APPROVAL
    );
  }
}
