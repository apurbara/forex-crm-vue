import AbstractPagination, {
  PaginationResponseType,
} from "@/resources/components/abstract-pagination";
import AbstractSalesService from "./abstract-sales-service";
import { CustomerAssignmentJourneyPayload } from "../model/sales/customer-assignment/customer-assignment-journey-payload";
import Fields from "gql-query-builder/build/Fields";

export default class CustomerAssignmentJourneyService extends AbstractSalesService {
  viewCustomerAssignmentJourneyList = async (
    pagination: AbstractPagination<CustomerAssignmentJourneyPayload>,
    selectionFields: Fields = ["id", "startTime", "endTime", { customerJourney: ["id", "name"] }]
  ) => {
    const response = await this.sales.executeSalesGraphqlQuery<{
      viewCustomerAssignmentJourneyList: PaginationResponseType<CustomerAssignmentJourneyPayload>;
    }>({
      operation: "viewCustomerAssignmentJourneyList",
      variables: pagination.toGraphqlVariables(),
      fields: pagination.wrapSelectionFields(selectionFields),
    });
    return response.viewCustomerAssignmentJourneyList;
  };
}
