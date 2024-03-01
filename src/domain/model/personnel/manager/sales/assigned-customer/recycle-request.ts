import { OptionalString } from "@/resources/types/custom-types";
import AssignedCustomer, { AssignedCustomerType } from "../assigned-customer";

export type RecycleRequestType = {
  id?: string;
  createdTime?: string;
  concludedTime?: string;
  status?: string;
  note?: string;
  remark?: string;
  assignedCustomer?: AssignedCustomerType;
};
export default class RecycleRequest {
  constructor(
    public assignedCustomer: AssignedCustomer = new AssignedCustomer(),
    public id: string = "",
    public createdTime: string = "",
    public concludedTime: string = "",
    public status: string = "WAITING_FOR_APPROVAL",
    public note: OptionalString = undefined,
    public remark: OptionalString = undefined
  ) {}

  load(data: RecycleRequestType) {
    this.id = data.id ?? this.id;
    this.createdTime = data.createdTime ?? this.createdTime;
    this.concludedTime = data.concludedTime ?? this.concludedTime;
    this.status = data.status ?? this.status;
    this.note = data.note;
    this.remark = data.remark;
    if (data.assignedCustomer) {
      this.assignedCustomer.load(data.assignedCustomer);
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
