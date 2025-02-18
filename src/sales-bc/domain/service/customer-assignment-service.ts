import { GraphqlBuilderOptions } from "@/resources/types/graphql";
import AbstractSalesService from "./abstract-sales-service";
import Fields from "gql-query-builder/build/Fields";
import {
  CustomerAssignmentType,
  ExtendedCustomerAssignmentType,
} from "../model/sales/customer-assignment";
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

export default class CustomerAssignmentService extends AbstractSalesService {
  //
  customerAssignmentDetail = async (
    id: string,
    selectionFields: Fields = customerAssignmentDetailSelectionFields
  ) => {
    const response = await this.sales.executeSalesGraphqlQuery<{
      customerAssignmentDetail: CustomerAssignmentType;
    }>({
      operation: "customerAssignmentDetail",
      variables: { id: { type: "ID", required: true, value: id } },
      fields: selectionFields,
    });
    return response.customerAssignmentDetail;
  };

  static buildUpdateCustomerAssignmentJourneyGraphqlOptions = (
    customerAssignmentId: string,
    customerJourneyId: string
  ): GraphqlBuilderOptions => {
    return {
      operation: "updateCustomerAssignmentJourney",
      variables: {
        id: { type: "ID", required: true, value: customerAssignmentId },
        CustomerJourney_id: {
          type: "ID",
          required: true,
          value: customerJourneyId,
        },
      },
      fields: [{ customerJourney: ["id", "name", "description", "initial"] }],
    };
  };

  customerAssignmentListRest = async (
    pagination: AbstractPagination<ExtendedCustomerAssignmentType>
  ) => {
    console.log(pagination.toQueryParams());
    const response = await this.sales.executeGetRequest<
      PaginationResponseType<ExtendedCustomerAssignmentType>
    >("/sales/view-customer-assignment-list", pagination.toQueryParams());
    return response;
  };
}
