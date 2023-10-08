export interface ArticleListDataInterface {
  id: string;
  name: string;
  description?: string;
}

export interface ArticleDataInterface {
  id: string;
  name: string;
  description?: string;
  content: string;
}

export default class Article {
  constructor(
    public id: string | undefined = undefined,
    public name: string = "",
    public description: string | undefined = undefined,
    public content: string = ""
  ) {}

  load(parameters: ArticleDataInterface) {
    this.id = parameters.id;
    this.name = parameters.name!;
    this.description = parameters.description;
    this.content = parameters.content;
  }
}
