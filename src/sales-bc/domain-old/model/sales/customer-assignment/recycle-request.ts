import CustomerAssignment, { CustomerAssignmentType } from "../customer-assignment";

export type RecycleRequestType = {
  id?: string;
  createdTime?: string;
  concludedTime?: string;
  status?: string;
  note?: string;
  remark?: string;
  customerAssignment?: CustomerAssignmentType;
};
export default class RecycleRequest {
  constructor(
    public customerAssignment: CustomerAssignment = new CustomerAssignment(),
    public id: string = "",
    public createdTime: string = "",
    public concludedTime: string = "",
    public status: string = "WAITING_FOR_APPROVAL",
    public note?: string,
    public remark?: string
  ) { }

  load(data: RecycleRequestType) {
    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.concludedTime = data.concludedTime ?? this.concludedTime;
    this.status = data.status ?? this.status;
    this.note = data.note;
    this.remark = data.remark;
    if (data.customerAssignment) {
      this.customerAssignment.load(data.customerAssignment);
    }
  }

  isValidProperties() {
    return true;
  }

  //
  toGraphqlVariables() {
    return {
      note: this.note,
    };
  }
}
