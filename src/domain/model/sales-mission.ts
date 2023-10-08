export interface SalesMissionListDataInterface {
  id: string;
  name: string;
  description?: string;
}

export interface SalesMissionDataInterface {
  id: string;
  name: string;
  description?: string;
}

export default class SalesMission {
  constructor(
    public id: string | undefined = undefined,
    public name: string = "",
    public description: string | undefined = undefined
  ) {}

  load(parameters: SalesMissionDataInterface) {
    this.id = parameters.id;
    this.name = parameters.name!;
    this.description = parameters.description;
  }
}
