import { OptionalString } from "../types/custom-types";
import AbstractPagination, {
  KeywordSearch,
  PaginationResponse,
} from "./abstract-pagination";
import EnumFilter from "./pagination/enum-filter";
import OrderType from "./pagination/order-type";

export type CursorLimitType = {
  pageSize: number;
  cursorToNextPage: OptionalString;
  total: number;
};

export class CursorLimit {
  public appliedOrder?: OrderType = undefined;
  public cursorToNextPage?: string = undefined;
  public total?: number = undefined;
  public cursor?: string = undefined;

  constructor(
    public pageSize: number = 20,
    public availableOrders: Array<OrderType> = []
  ) {}

  load(cursorLimit: CursorLimitType): void {
    this.pageSize = cursorLimit.pageSize;
    this.cursorToNextPage = cursorLimit.cursorToNextPage;
    this.total = cursorLimit.total;
    this.cursor = undefined;
  }

  //
  toGraphqlVariables() {
    return {
      pageSize: this.pageSize,
      cursor: this.cursor,
      orders: this.appliedOrder
        ? [
            {
              column: this.appliedOrder.column,
              direction: this.appliedOrder.direction,
            },
          ]
        : undefined,
    };
  }

  //
  reset(): void {
    this.cursorToNextPage = undefined;
    this.total = undefined;
    this.cursor = undefined;
  }
}

export default class CursorPagination<
  ResultType
> extends AbstractPagination<ResultType> {
  public resultList: Array<ResultType> = [];

  constructor(
    viewListCallback: (
      pagination: AbstractPagination<ResultType>
    ) => Promise<PaginationResponse<ResultType>>,
    availableFilters: Array<EnumFilter> = [],
    keywordSearch: KeywordSearch | undefined = undefined,
    public cursorLimit: CursorLimit = new CursorLimit()
  ) {
    super(viewListCallback, availableFilters, keywordSearch);
  }

  //
  toGraphqlVariables() {
    return {
      ...super.toGraphqlVariables(),
      cursorLimit: {
        value: this.cursorLimit.toGraphqlVariables(),
        type: "CursorLimitInput",
      },
    };
  }

  static wrapResultFields(fields: Array<string>) {
    return [
      { list: fields },
      { cursorLimit: ["pageSize", "total", "cursorToNextPage"] },
    ];
  }

  //
  async loadPage(): Promise<void> {
    const response = await this.viewListCallback(this);
    this.resultList.push(...response.list);
    this.cursorLimit.load(response.cursorLimit!);
  }
  async loadNextPage(): Promise<void> {
    this.cursorLimit.cursor = this.cursorLimit.cursorToNextPage;
    const response = await this.viewListCallback(this);
    this.resultList.push(...response.list);
    this.cursorLimit.load(response.cursorLimit!);
  }
  async resetList(): Promise<void> {
    this.resultList.length = 0;
    this.cursorLimit.reset();
    await this.loadPage();
  }
  async applyOrder(): Promise<void> {
    await this.resetList();
  }
}
