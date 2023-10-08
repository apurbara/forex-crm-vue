export interface AdminListDataInterface {
  id?: string;
  name?: string;
  phone?: string;
}

export interface AdminDataInterface {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export default class Admin {
  id?: string;
  name: string;
  email: string;
  phone: string;

  constructor(parameters: AdminDataInterface = {}) {
    this.id = parameters.id;
    this.name = parameters.name ?? "";
    this.email = parameters.email ?? "";
    this.phone = parameters.phone ?? "";
  }

  load(parameters: AdminDataInterface = {}) {
    this.id = parameters.id ?? this.id;
    this.name = parameters.name ?? this.name;
    this.email = parameters.email ?? this.email;
    this.phone = parameters.phone ?? this.phone;
  }
}
