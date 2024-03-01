import { OptionalString, PrimitiveTypes } from "../types/custom-types";
import { CursorLimitType } from "./cursor-pagination";
import { OffsetLimitType } from "./offset-pagination";
import EnumFilter, { FilterType } from "./pagination/enum-filter";

export type PaginationResponseType<ResultType> = {
  list: Array<ResultType>;
  cursorLimit?: CursorLimitType;
  offsetLimit?: OffsetLimitType;
};

export class KeywordSearch {
  public value?: string = undefined;
  constructor(
    public columns: string[],
    public comparisonType: OptionalString = "LIKE"
  ) {}

  //
  toJSON() {
    return {
      columns: this.columns,
      comparisonType: this.comparisonType,
      value: this.comparisonType === "LIKE" ? `%${this.value}%` : this.value,
    };
  }
}

export default abstract class AbstractPagination<ResultType> {
  constructor(
    public viewListCallback: (
      pagination: AbstractPagination<ResultType>
    ) => Promise<PaginationResponseType<ResultType>>,
    public availableFilters: Array<EnumFilter> = [],
    public keywordSearch: KeywordSearch | undefined = undefined
  ) {}

  //
  noAppliedFilter(): boolean {
    return this.availableFilters.every((filter) => filter.noAppliedFilter());
  }

  //
  async resetFilter(): Promise<void> {
    this.availableFilters.forEach((filter) => {
      filter.resetSelections();
    });
    this.resetList();
  }
  async removeFilterSelectedItem(
    filter: EnumFilter,
    selectedItem: { [key: string]: PrimitiveTypes }
  ): Promise<void> {
    filter.removeSelectedItem(selectedItem);
    this.resetList();
  }

  //
  toGraphqlVariables() {
    const filters: Array<FilterType> = [];
    this.availableFilters.forEach((availableFilter) => {
      const filter = availableFilter.toGraphqlVariables();
      if (filter) {
        filters.push(filter);
      }
    });
    return {
      keywordSearch: {
        value: this.keywordSearch?.value ? this.keywordSearch : null,
        type: "KeywordSearchInput",
      },
      filters: { value: filters, type: "[FilterInput]" },
    };
  }

  toQueryParams() {
    const filters: Array<FilterType> = [];
    this.availableFilters.forEach((availableFilter) => {
      const filter = availableFilter.toQueryParams();
      if (filter) {
        filters.push(filter);
      }
    });
    return {
      keywordSearch: this.keywordSearch?.value ? this.keywordSearch.toJSON() : null,
      filters: filters,
    };
  }

  //
  abstract loadPage(): void;
  abstract resetList(): void;
}
