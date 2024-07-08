import Area, { AreaType } from "./area-structure/area";
import VerificationReport, { VerificationReportType } from "./customer/verification-report";

export type CustomerType = {
  id?: string;
  createdTime?: string;
  email?: string;
  name?: string;
  phone?: string;
  source?: string;
  verificationScore?: number;
  area?: AreaType;
  verificationReports?: VerificationReportType[];
};

export default class Customer {
  id?: string;
  email: string = "";
  name: string = "";
  phone: string = "";
  source: string = "";
  area?: Area;
  verificationReports: VerificationReport[] = [];

  constructor(data: CustomerType = {}) {
    this.load(data);
  }

  load(data: CustomerType) {
    this.id = data.id ?? this.id;
    this.email = data.email ?? this.email;
    this.name = data.name ?? this.name;
    this.phone = data.phone ?? this.phone;
    this.source = data.source ?? this.source;
    if (data.area) {
      this.area ??= new Area();
      this.area.load(data.area);
    }
    data.verificationReports ?? [].forEach(verificationReportData => {
      const verificationReport = new VerificationReport();
      verificationReport.load(verificationReportData);
      this.verificationReports.push(verificationReport);
    });
  }

  //
  countVerificationReportScore(): number {
    return this.verificationReports?.reduce<number>(
      (accumulator, verificationReport) =>
        accumulator + (verificationReport.customerVerification?.disabled ? 0 : (verificationReport.customerVerification?.weight ?? 0)), 0
    )
  }

}
