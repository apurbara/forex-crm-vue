import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { CustomerAssignmentType } from "../customer-assignment";

export type CustomerAssignmentJourneyPayload = {
  id?: string;
  startTime?: string;
  endTime?: string;
  //
  CustomerJourney_id?: string;
  customerJourney?: CustomerJourneyType;
  //
  CustomerAssignment_id?: string;
  customerAssignment?: CustomerAssignmentType;
};
