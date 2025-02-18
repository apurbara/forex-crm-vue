import AbstractPagination, {
  PaginationResponseType,
} from "@/resources/components/abstract-pagination";
import AbstractSalesService from "./abstract-sales-service";
import SalesActivitySchedule, {
  ExtendedSalesActivityScheduleType,
  SalesActivityScheduleType,
} from "../model/sales/customer-assignment/salesActivitySchedule";
import Fields from "gql-query-builder/build/Fields";

export const salesActivityScheduleListSelectionFields: Fields = [
  ...["id", "startTime", "endTime", "status"],
  { salesActivity: ["name", "description", "duration", "initial", "disabled"] },
  { salesActivityReport: ["id", "submitTime", "content"] },
];

export default class SalesActivityScheduleService extends AbstractSalesService {
  //
  salesActivityScheduleList = async (
    pagination: AbstractPagination<SalesActivityScheduleType>,
    selectionFields: Fields = salesActivityScheduleListSelectionFields
  ): Promise<PaginationResponseType<SalesActivityScheduleType>> => {
    const response = await this.sales.executeSalesGraphqlQuery<{
      salesActivityScheduleList: PaginationResponseType<SalesActivityScheduleType>;
    }>({
      operation: "salesActivityScheduleList",
      variables: pagination.toGraphqlVariables(),
      fields: pagination.wrapSelectionFields(selectionFields),
    });
    return response.salesActivityScheduleList;
  };

  submitSalesActivitySchedule = async (salesActivitySchedule: SalesActivitySchedule) => {
    const response = await this.sales.executeSalesGraphqlMutation<{
      submitSalesActivitySchedule: SalesActivityScheduleType;
    }>({
      operation: "submitSalesActivitySchedule",
      variables: {
        CustomerAssignment_id: {
          type: "ID",
          required: true,
          value: salesActivitySchedule.customerAssignment?.id,
        },
        ...salesActivitySchedule.toGraphqlVariables(),
      },
      fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }],
    });
    return response.submitSalesActivitySchedule;
  };

  salesActivityScheduleListRest = async (
    pagination: AbstractPagination<ExtendedSalesActivityScheduleType>
  ) => {
    console.log(pagination.toQueryParams());
    const response = await this.sales.executeGetRequest<
      PaginationResponseType<ExtendedSalesActivityScheduleType>
    >("/sales/view-sales-activity-schedule-list", pagination.toQueryParams());
    return response;
  };
}
