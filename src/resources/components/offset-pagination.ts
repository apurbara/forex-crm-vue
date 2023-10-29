import AbstractPagination, {
  KeywordSearch,
  PaginationResponse,
} from "./abstract-pagination";
import EnumFilter from "./pagination/enum-filter";
import OrderType from "./pagination/order-type";

export type OffsetLimitType = {
  pageSize: number;
  page: number;
  total: number;
};

export class OffsetLimit {
  public total?: number = undefined;
  public appliedOrder?: OrderType = undefined;

  constructor(
    public pageSize: number = 20,
    public page: number = 1,
    public availableOrders: Array<OrderType> = []
  ) {}

  load(offsetLimit: OffsetLimitType): void {
    this.pageSize = offsetLimit.pageSize;
    this.page = offsetLimit.page;
    this.total = offsetLimit.total;
  }

  //
  toJSON() {
    return {
      pageSize: this.pageSize,
      page: this.page,
      orders: [this.appliedOrder],
    };
  }

  //
  reset(): void {
    this.page = 1;
    this.total = undefined;
  }
  getTotalPage() {
    return Math.ceil((this.total ?? 0) / this.pageSize) || 1;
  }
  setToPage(page: number) {
    if (page >= 1 && this.getTotalPage() >= page) {
      this.page = page;
    }
  }
}

export default class OffsetPagination<
  ResultType
> extends AbstractPagination<ResultType> {
  public resultList: Array<ResultType> = [];

  constructor(
    viewListCallback: (
      pagination: AbstractPagination<ResultType>
    ) => Promise<PaginationResponse<ResultType>>,
    filters: Array<EnumFilter> = [],
    keywordSearch: KeywordSearch | undefined = undefined,
    public offsetLimit: OffsetLimit = new OffsetLimit()
  ) {
    super(viewListCallback, filters, keywordSearch);
  }

  //
  toGraphqlVariables() {
    return {
      ...super.toGraphqlVariables(),
      offsetLimit: { value: this.offsetLimit, type: "OffsetLimitInput" },
    };
  }

  static wrapResultFields(fields: Array<any>) {
    return [{ list: fields }, { offsetLimit: ["page", "pageSize", "total"] }];
  }

  //
  async loadPage(): Promise<void> {
    this.resultList.length = 0;
    const response = await this.viewListCallback(this);
console.log(response);
    this.resultList = response.list;
    this.offsetLimit.load(response.offsetLimit!);
  }
  async resetList(): Promise<void> {
    this.offsetLimit.reset();
    await this.loadPage();
  }
}
