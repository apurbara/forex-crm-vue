import { OptionalString, PrimitiveTypes } from "@/resources/types/custom-types";

export type FilterType = {
  column: string;
  comparisonType: string;
  value: Array<any>;
};

export default class EnumFilter {
  type: string = "ENUM";

  public items: Array<{ [key: string]: PrimitiveTypes }> = [];
  public selectedItems: Array<{ [key: string]: PrimitiveTypes }> = [];
  // public itemValue: string = "id",

  constructor(
    public label: string,
    public column: string,
    public itemListCallback: () => Array<{ [key: string]: PrimitiveTypes }>,
    public comparisonType: string = "IN",
    public placeholder: OptionalString = undefined,
    public itemTitle: string = "name",
    public itemValue: string = "id"
  ) {}

  //
  toGraphqlVariables(): FilterType | undefined {
    return this.selectedItems.length > 0
      ? {
          column: this.column,
          comparisonType: this.comparisonType,
          value: this.selectedItems.map(
            (selectedItem) => selectedItem[this.itemValue]
          ),
        }
      : undefined;
  }
  toQueryParams(): FilterType | undefined {
    return this.selectedItems.length > 0
      ? {
          column: this.column,
          comparisonType: this.comparisonType,
          value: this.selectedItems.map(
            (selectedItem) => selectedItem[this.itemValue]
          ),
        }
      : undefined;
  }

  //
  async initItems(): Promise<void> {
    this.items = await this.itemListCallback();
  }

  //
  noAppliedFilter(): boolean {
    return this.selectedItems.length < 1;
  }

  removeSelectedItem(selectedItem: { [key: string]: PrimitiveTypes }): void {
    // console.log(appliedFilterValue);
    const index = this.selectedItems.indexOf(selectedItem);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    }
  }

  resetSelections(): void {
    this.selectedItems.length = 0;
  }
}
