import Fields from "gql-query-builder/build/Fields";
import SalesActivityReport, {
  SalesActivityReportType,
} from "../model/sales/customer-assignment/sales-activity-schedule/sales-activity-report";
import AbstractSalesService from "./abstract-sales-service";
import { SalesActivityScheduleType } from "../model/sales/customer-assignment/salesActivitySchedule";
import { GraphqlBuilderOptions } from "@/resources/types/graphql";

export const salesActivityScheduleDetailSelectionField: Fields = [
  ...["id", "status", "startTime", "endTime"],
  { salesActivity: ["id", "name"] },
  { salesActivityReport: ["content", "submitTime"] },
];
export default class SalesActivityReportService extends AbstractSalesService {
  //
  static buildSubmitNonScheduleSalesActivityReportGraphqlOptions = (
    salesActivityReport: SalesActivityReport,
    selectionField: Fields = salesActivityScheduleDetailSelectionField
  ): GraphqlBuilderOptions => {
    return {
      operation: "submitNonScheduledSalesActivityReport",
      variables: {
        CustomerAssignment_id: {
          type: "ID",
          value: salesActivityReport.salesActivitySchedule?.customerAssignment?.id,
        },
        SalesActivity_id: {
          type: "ID",
          value: salesActivityReport.salesActivitySchedule?.salesActivity?.id,
        },
        ...salesActivityReport.toGraphqlVariables(),
      },
      fields: selectionField,
    };
  };

  static buildSubmitScheduledSalesActivityReportGraphqlOptions = (
    salesActivityReport: SalesActivityReport,
    selectionField: Fields = ["content", "submitTime"]
  ): GraphqlBuilderOptions => {
    return {
      operation: "submitSalesActivityReport",
      variables: {
        SalesActivitySchedule_id: {
          type: "ID",
          value: salesActivityReport.salesActivitySchedule?.id,
        },
        ...salesActivityReport.toGraphqlVariables(),
      },
      fields: selectionField,
    };
  };
  //
  async submitNonScheduleSalesActivityReport(
    salesActivityReport: SalesActivityReport,
    customerAssignmentId: string,
    selectionField: Fields = salesActivityScheduleDetailSelectionField
  ): Promise<SalesActivityScheduleType> {
    const response = await this.sales.executeSalesGraphqlMutation<{
      submitNonScheduledSalesActivityReport: SalesActivityScheduleType;
    }>({
      operation: "submitNonScheduledSalesActivityReport",
      variables: {
        CustomerAssignment_id: { type: "ID", value: customerAssignmentId },
        SalesActivity_id: {
          type: "ID",
          value: salesActivityReport.salesActivitySchedule?.salesActivity?.id,
        },
        ...salesActivityReport.toGraphqlVariables(),
      },
      fields: selectionField,
    });
    return response.submitNonScheduledSalesActivityReport;
  }
  //
  async submitScheduledSalesActivityReport(
    salesActivityReport: SalesActivityReport,
    customerAssignmentId: string,
    selectionField: Fields = ["content", "submitTime"]
  ): Promise<SalesActivityReportType> {
    const response = await this.sales.executeSalesGraphqlMutation<{
      submitSalesActivityReport: SalesActivityReportType;
    }>({
      operation: "submitSalesActivityReport",
      variables: {
        CustomerAssignment_id: { type: "ID", value: customerAssignmentId },
        SalesActivitySchedule_id: {
          type: "ID",
          value: salesActivityReport.salesActivitySchedule?.id,
        },
        ...salesActivityReport.toGraphqlVariables(),
      },
      fields: selectionField,
    });
    return response.submitSalesActivityReport;
  }
}
