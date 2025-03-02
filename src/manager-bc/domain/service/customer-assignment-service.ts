import Fields from "gql-query-builder/build/Fields";
import AbstractManagerService from "./AbstractManagerService";
import {
  CustomerAssignmentType,
  ExtendedCustomerAssignmentType,
} from "../model/manager/sales/customer-assignment";
import AbstractPagination, {
  PaginationResponseType,
} from "@/resources/components/abstract-pagination";

export const customerAssignmentDetailSelectionFields: Fields = [
  ...["id", "status", "createdTime"],
  {
    customer: [
      ...["name", "email", "phone"],
      { city: ["id", "name"] },
      { verificationReports: ["id", "note", "CustomerVerification_id"] },
    ],
  },
  { customerJourney: ["id", "name", "description", "initial"] },
];
export const customerAssignmentListSelectionFields: Fields = [
  ...["id", "status", "createdTime"],
  {
    customer: [
      ...["name", "email", "phone"],
      { city: ["id", "name"] },
      { verificationReports: ["id", "note", "CustomerVerification_id"] },
    ],
  },
  { customerJourney: ["id", "name", "description", "initial"] },
];

export default class CustomerAssignmentService extends AbstractManagerService {
  //
  customerAssignmentDetail = async (
    id: string,
    selectionFields: Fields = customerAssignmentDetailSelectionFields
  ) => {
    const response = await this.manager.executeManagerGraphqlQuery<{
      customerAssignmentDetail: CustomerAssignmentType;
    }>({
      operation: "customerAssignmentDetail",
      variables: { id: { type: "ID", required: true, value: id } },
      fields: selectionFields,
    });
    return response.customerAssignmentDetail;
  };

  customerAssignmentListRest = async (
    pagination: AbstractPagination<ExtendedCustomerAssignmentType>
  ) => {
    console.log(pagination.toQueryParams());
    const response = await this.manager.executeGetRequest<
      PaginationResponseType<ExtendedCustomerAssignmentType>
    >("/manager/view-customer-assignment-list", pagination.toQueryParams());
    return response;
  };
}
