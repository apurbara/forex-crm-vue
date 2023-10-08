export interface MailContentListDataInterface {
  id: string;
  name: string;
  description?: string;
}

export interface MailContentDataInterface {
  id: string;
  name: string;
  description?: string;
  content: string;
}

export default class MailContent {
  constructor(
    public id: string | undefined = undefined,
    public name: string = "",
    public description: string | undefined = undefined,
    public content: string = ""
  ) {}

  load(parameters: MailContentDataInterface) {
    this.id = parameters.id;
    this.name = parameters.name!;
    this.description = parameters.description;
    this.content = parameters.content;
  }
}
