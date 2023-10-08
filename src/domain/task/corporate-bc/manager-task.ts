import HttpRequestInterface from "@/domain/http-request-interface";
import {
  ManagerDataInterface,
  ManagerListDataInterface,
} from "@/domain/model/manager";
import Manager from "@/domain/user-role/manager";
import Pagination, {
  PaginationResponseDataInterface,
} from "@/resources/components/pagination";

export default class ManagerTask {
  constructor(protected httpRequest: HttpRequestInterface) {}

  async viewList(
    pagination: Pagination<ManagerListDataInterface>,
    token: string
  ): Promise<PaginationResponseDataInterface<ManagerListDataInterface>> {
    return await this.httpRequest.get(
      "/manager",
      token,
      pagination.getQueryParameters()
    );
  }

  async viewDetail(
    managerId: string,
    token: string
  ): Promise<ManagerDataInterface> {
    return await this.httpRequest.get(`/manager/${managerId}`, token);
  }

  async add(manager: Manager, token: string): Promise<ManagerDataInterface> {
    return await this.httpRequest.post("/manager", manager, token);
  }
}
