import { CustomerListDataInterface } from "./customer";

export interface SalesListDataInterface {
  id: string;
  name: string;
  phone?: string;
  location?: string;
  inHouse: boolean;
  targetRealization?: number;
  managedCustomerCount?: number;
}

export interface SalesDataInterface {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  inHouse: boolean;
}

export interface ComprehensiveSalesDataInterface {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  inHouse?: boolean;
  targetRealization?: number;
  managedCustomers?: Array<CustomerListDataInterface>;
}

export default class Sales {
  constructor(
    public id: string | undefined = undefined,
    public name: string = "",
    public email: string = "",
    public phone: string = "",
    public location: string | undefined = undefined,
    public inHouse: boolean = false
  ) {}

  load(parameters: SalesDataInterface) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.email = parameters.email;
    this.phone = parameters.phone;
    this.location = parameters.location;
    this.inHouse = parameters.inHouse;
  }
}
