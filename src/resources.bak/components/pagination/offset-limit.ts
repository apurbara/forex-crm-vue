export interface OffsetLimitResponseInterface {
  pageSize?: number;
  page?: number;
  total: number;
}

export default class OffsetLimit {
  // pageSize: number;
  // page: number;
  // total?: number;

  constructor(
    public pageSize: number = 20,
    public page: number = 1,
    public total: number | undefined = undefined
  ) {
    // this.pageSize = pageInfo.pageSize ?? 20;
    // this.page = pageInfo.page ?? 1;
  }

  load(pageInfo: OffsetLimitResponseInterface) {
    this.pageSize = pageInfo.pageSize ?? this.pageSize;
    this.page = pageInfo.page ?? this.page;
    this.total = pageInfo.total;
  }

  //
  reset() {
    this.page = 1;
  }

  //
  getQueryParameters() {
    return {
      offset: (this.page - 1) * this.pageSize,
      limit: this.pageSize,
    };
  }

  //
  getTotalPage() {
    return Math.ceil((this.total ?? 0) / this.pageSize) || 1;
  }

  setToPage(page: number) {
    if (page >= 1 && this.getTotalPage() >= page) {
      this.page = page;
    }
  }
}
