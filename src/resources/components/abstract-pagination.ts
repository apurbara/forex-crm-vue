import { OptionalString } from "../types/custom-types";
import { CursorLimitType } from "./cursor-pagination";
import { OffsetLimitType } from "./offset-pagination";
import EnumFilter, { EnumFilterItemType } from "./pagination/enum-filter";
import FilterType from "./pagination/filter";

export type PaginationResponseType<ResultType> = {
  list: Array<ResultType>;
  cursorLimit?: CursorLimitType;
  offsetLimit?: OffsetLimitType;
};

export class KeywordSearch {
  public value?: string = undefined;
  constructor(
    public columns: string[],
    public comparisonType: OptionalString = "LIKE",
    public placeholder: OptionalString = undefined,
  ) { }

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
  hiddenFilters: FilterType[] = [];

  constructor(
    public viewListCallback: (
      pagination: AbstractPagination<ResultType>
    ) => Promise<PaginationResponseType<ResultType>>,
    public availableFilters: EnumFilter[] = [],
    public keywordSearch: KeywordSearch | undefined = undefined
  ) { }

  //
  hasSelectedFilter(): boolean {
    return this.availableFilters.some(filter => filter.hasSelectedFilter());
  }

  //
  async resetFilter(): Promise<void> {
    this.availableFilters.forEach((filter) => {
      filter.resetSelections();
    });
    this.resetList();
  }
  async removeFilterSelectedItem(filter: EnumFilter, selectedItem: EnumFilterItemType): Promise<void> {
    filter.removeSelectedItem(selectedItem);
    this.resetList();
  }

  addHiddenFilter(filter: FilterType): void {
    this.hiddenFilters.push(filter);
  }

  //
  toGraphqlVariables() {
    const filters: FilterType[] = [];
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
      filters: { value: [...filters, ...this.hiddenFilters], type: "[FilterInput]" },
    };
  }

  toQueryParams() {
    const filters: FilterType[] = [];
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
