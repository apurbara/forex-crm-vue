export interface ProductListDataInterface {
  id: string;
  name: string;
  description?: string;
  score: number;
}

export interface ProductDataInterface {
  id: string;
  name: string;
  description?: string;
  score: number;
}

export default class Product {
  constructor(
    public id: string | undefined = undefined,
    public name: string = "",
    public description: string | undefined = undefined,
    public score: number = 100
  ) {}

  load(parameters: ProductDataInterface) {
    this.id = parameters.id;
    this.name = parameters.name!;
    this.description = parameters.description;
    this.score = parameters.score;
  }
}
