import AbstractPagination, {
  PaginationResponseType,
} from "@/resources/components/abstract-pagination";
import RecycleRequest, {
  RecycleRequestType,
} from "../model/sales/customer-assignment/recycle-request";
import AbstractSalesService from "./abstract-sales-service";
import Fields from "gql-query-builder/build/Fields";

export default class RecycleRequestService extends AbstractSalesService {
  submitRecycleRequest = async (recycleRequest: RecycleRequest) => {
    const response = await this.sales.executeSalesGraphqlMutation<{
      submitRecycleRequest: RecycleRequestType;
    }>({
      operation: "submitRecycleRequest",
      variables: {
        ...recycleRequest.toGraphqlVariables(),
        CustomerAssignment_id: { type: "ID", value: recycleRequest.customerAssignment?.id },
      },
      fields: ["id", "status", "createdTime", "note"],
    });
    return response.submitRecycleRequest;
  };

  recycleRequestList = async (
    pagination: AbstractPagination<RecycleRequestType>,
    selectionFields: Fields = ["id", "status", "createdTime", "note"]
  ) => {
    const response = await this.sales.executeSalesGraphqlQuery<{
      recycleRequestList: PaginationResponseType<RecycleRequestType>;
    }>({
      operation: "recycleRequestList",
      variables: pagination.toGraphqlVariables(),
      fields: pagination.wrapSelectionFields(selectionFields),
    });
    return response.recycleRequestList;
  };
}
