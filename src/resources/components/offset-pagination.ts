import store from "@/store";
import AbstractPagination, {
  KeywordSearch,
  PaginationResponseType,
} from "./abstract-pagination";
import EnumFilter from "./pagination/enum-filter";
import OrderType from "./pagination/order-type";

export type OffsetLimitType = {
  pageSize?: number;
  page?: number;
  total?: number;
  availableOrders?: OrderType[];
  appliedOrder?: OrderType;
};

export class OffsetLimit {
  pageSize: number = 10;
  page: number = 1;
  total?: number = undefined;
  availableOrders: OrderType[] = [];
  appliedOrder?: OrderType = undefined;
  // public total?: number = undefined;
  // public appliedOrder?: OrderType = undefined;

  constructor(data: OffsetLimitType = {}) {
    this.load(data);
  }

  load(data: OffsetLimitType): void {
    this.pageSize = data.pageSize ?? this.pageSize;
    this.page = data.page ?? this.page;
    this.total = data.total ?? this.total;
    this.availableOrders = data.availableOrders ?? this.availableOrders;
    this.appliedOrder = data.appliedOrder ?? this.appliedOrder;
  }

  //
  toJSON() {
    return {
      pageSize: this.pageSize,
      page: this.page,
      orders: this.appliedOrder ? [this.appliedOrder] : [],
    };
  }
  toStateObject(): Object {
    return { ...this.toJSON(), availableOrders: this.availableOrders };
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
    ) => Promise<PaginationResponseType<ResultType>>,
    filters: EnumFilter[] = [],
    keywordSearch: KeywordSearch | undefined = undefined,
    public offsetLimit: OffsetLimit = new OffsetLimit(),
    public paginationStateIndex: string | undefined = undefined
  ) {
    super(viewListCallback, filters, keywordSearch);
    if (this.paginationStateIndex) {
      const storedState = sessionStorage.getItem(this.paginationStateIndex);
      console.log(storedState);
      if (storedState) {
        this.offsetLimit.load(JSON.parse(storedState));
      }
    }
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
    this.resultList = response.list;
    this.offsetLimit.load(response.offsetLimit!);
    if (this.paginationStateIndex) {
      sessionStorage.setItem(
        this.paginationStateIndex,
        JSON.stringify(this.offsetLimit.toStateObject())
      );
    }
  }
  async resetList(): Promise<void> {
    this.offsetLimit.reset();
    await this.loadPage();
  }
}
