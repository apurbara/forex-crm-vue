export interface ManagerListDataInterface {
  id?: string;
  name?: string;
  phone?: string;
}

export interface ManagerDataInterface {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export default class Manager {
  id?: string;
  name: string;
  email: string;
  phone: string;

  constructor(parameters: ManagerDataInterface = {}) {
    this.id = parameters.id;
    this.name = parameters.name ?? "";
    this.email = parameters.email ?? "";
    this.phone = parameters.phone ?? "";
  }

  load(parameters: ManagerDataInterface = {}) {
    this.id = parameters.id ?? this.id;
    this.name = parameters.name ?? this.name;
    this.email = parameters.email ?? this.email;
    this.phone = parameters.phone ?? this.phone;
  }
}
