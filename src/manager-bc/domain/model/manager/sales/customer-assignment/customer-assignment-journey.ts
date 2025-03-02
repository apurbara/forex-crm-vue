import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";

export type customerAssignmentJourneyType = {
  id?: string;
  startTime?: string;
  endTime?: string;
  //
  CustomerJourney_id?: string;
  customerJourney?: CustomerJourneyType;
};
