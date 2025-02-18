import AbstractPagination, {
  PaginationResponseType,
} from "@/resources/components/abstract-pagination";
import ClosingRequest, {
  ClosingRequestType,
} from "../model/sales/customer-assignment/closing-request";
import AbstractSalesService from "./abstract-sales-service";
import Fields from "gql-query-builder/build/Fields";

export default class ClosingRequestService extends AbstractSalesService {
  submitClosingRequest = async (closingRequest: ClosingRequest) => {
    const response = await this.sales.executeSalesGraphqlMutation<{
      submitClosingRequest: ClosingRequestType;
    }>({
      operation: "submitClosingRequest",
      variables: {
        ...closingRequest.toGraphqlVariables(),
        CustomerAssignment_id: { type: "ID", value: closingRequest.customerAssignment?.id },
      },
      fields: ["id", "status", "createdTime", "transactionValue", "note"],
    });
    return response.submitClosingRequest;
  };

  closingRequestList = async (
    pagination: AbstractPagination<ClosingRequestType>,
    selectionFields: Fields = ["id", "status", "createdTime", "note", "transactionValue"]
  ) => {
    const response = await this.sales.executeSalesGraphqlQuery<{
      closingRequestList: PaginationResponseType<ClosingRequestType>;
    }>({
      operation: "closingRequestList",
      variables: pagination.toGraphqlVariables(),
      fields: pagination.wrapSelectionFields(selectionFields),
    });
    return response.closingRequestList;
  };
}
