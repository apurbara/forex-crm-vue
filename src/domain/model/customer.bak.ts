export interface CustomerListDataInterface {
  id: string;
  email: string;
  name?: string;
  location?: string;
  activityTotalScores?: number;
  managingSales?: { id: string; sales: { id: string; name: string } };
}

export interface ComprehensiveCustomerDataInterface {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  location?: string;
  activityTotalScores?: number;
  activityScoreDistributions?: { [key: string]: number }; //{ productOne : productOneActivityScore }
  managingSalesList?: Array<{
    id: string;
    assignmentTime: string;
    disabled: boolean;
    sales: { id: string; name: string };
  }>;
  salesMissionReportHistory?: Array<{
    id: string;
    reportTime: string;
    managingSalesReporter: { id: string; sales: { id: string; name: string } };
  }>;
  activityLog?: Array<{
    id: string;
    time: string;
    article: { id: string; name: string };
  }>;
}
