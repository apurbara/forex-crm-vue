import EnumFilter from "./pagination/enum-filter";
import OffsetLimit, {
  OffsetLimitResponseInterface,
} from "./pagination/offset-limit";
import Sorting from "./pagination/sorting";

export interface PaginationResponseDataInterface<ExpectedResponseType> {
  list: Array<ExpectedResponseType>;
  pageInfo: OffsetLimitResponseInterface;
}

export default class Pagination<ExpectedResponseType> {
  keywordSearch?: string = undefined;
  filters: Array<EnumFilter> = [];
  hiddenFilters: Array<EnumFilter> = [];
  // hiddenFilterStatus: Array<FilterInterface> = [];
  list: Array<ExpectedResponseType> = [];
  loading: boolean = false;

  //
  constructor(
    public viewListCallback: CallableFunction = () => [],
    public offsetLimit: OffsetLimit = new OffsetLimit(),
    public keywordSearchColumns: Array<string> = [],
    public sorting: Sorting = new Sorting()
  ) {}

  load(
    paginationResponse: PaginationResponseDataInterface<ExpectedResponseType>
  ) {
    this.list = paginationResponse.list;
    this.offsetLimit.load(paginationResponse.pageInfo);
  }

  getQueryParameters(): { [key: string]: any } | undefined {
    // let filterParameters = "";
    // if (
    //   this.keywordSearch &&
    //   this.keywordSearch?.length > 0 &&
    //   this.keywordSearchColumns.length > 0
    // ) {
    //   this.keywordSearchColumns.forEach((column) => {
    //     filterParameters +=
    //       (filterParameters.length == 0 ? "" : ` or `) +
    //       `${column}=ilike='${this.keywordSearch}'`;
    //   });
    // }
    // if (filterParameters.length > 0) {
    //   filterParameters = "(" + filterParameters + ")";
    // }
    // this.hiddenFilters.forEach((filter) => {
    //   filterParameters +=
    //     (filterParameters.length == 0 ? "" : ` and `) +
    //     "" +
    //     filter.getFilterParameter();
    // });
    // this.hiddenFiltersStatus.forEach((filter) => {
    //   filterParameters +=
    //     (filterParameters.length == 0 ? "" : ` and `) +
    //     "" +
    //     filter.getFilterParameterStatus();
    // });
    // this.filters.forEach((filter) => {
    //   if (filter.getFilterParameter()?.length > 0) {
    //     filterParameters +=
    //       (filterParameters.length == 0 ? "" : ` and `) +
    //       "" +
    //       filter.getFilterParameter();
    //   }
    // });

    // return {
    //   ...this.offsetLimit.getQueryParameters(),
    //   ...this.sorting,
    //   filter: filterParameters.length > 0 ? filterParameters : undefined,
    // };
    return {};
  }

  //
  async init() {
    this.loading = true;
    const result = await this.viewListCallback(this);
    this.load(result);
    this.loading = false;
  }
  async renewList() {
    this.loading = true;
    this.offsetLimit.reset();
    this.list.length = 0;
    await this.init();
    this.loading = false;
  }

  //
  addFilter(filter: EnumFilter) {
    this.filters.push(filter);
    return this;
  }
  addHiddenFilter(hiddenFilter: EnumFilter) {
    this.hiddenFilters.push(hiddenFilter);
    return this;
  }
  // addHiddenFilterStatus(hiddenFilter: FilterInterface) {
  //   this.hiddenFiltersStatus.push(hiddenFilter);
  //   return this;
  // }

  //
  getAppliedFilters(): Array<any> {
    const appliedFilters: Array<any> = [];
    this.filters.forEach((filter) => {
      appliedFilters.push(...filter.getAppliedFilters());
    });
    return appliedFilters;
  }
  async resetFilters() {
    this.filters.forEach((filter) => {
      filter.resetSelections();
    });
    await this.renewList();
  }
  async removeAppliedFilter(filter: EnumFilter, appliedFilterValue: string) {
    filter.removeAppliedFilter(appliedFilterValue);
    await this.renewList();
  }

  //
  getSortingIcon(column: string) {
    return this.sorting.sortBy !== column
      ? "mdi-swap-vertical"
      : this.sorting.direction === "asc"
      ? "mdi-sort-ascending"
      : "mdi-sort-descending";
  }
  async sortColumn(column: string) {
    if (this.sorting.sortBy === column) {
      this.sorting.swapDirection();
    } else {
      this.sorting.initSort(column);
    }
    await this.renewList();
  }
}
