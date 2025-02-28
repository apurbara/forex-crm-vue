import { OptionalString, PrimitiveTypes } from "@/resources/types/custom-types";
import FilterType from "./filter";

export type EnumFilterItemType = {
  value: PrimitiveTypes,
  label: string,
}

export default class EnumFilter {
  public items: EnumFilterItemType[] = [];
  public selectedItems: EnumFilterItemType[] = [];

  constructor(
    public title: string,
    public column: string,
    public itemListCallback: () => EnumFilterItemType[] | Promise<EnumFilterItemType[]>,
    public placeholder: OptionalString = undefined,
  ) { }

  //
  toGraphqlVariables(): FilterType | undefined {
    return this.selectedItems.length > 0
      ? {
        column: this.column,
        comparisonType: "IN",
        value: this.selectedItems.map(
          (selectedItem) => selectedItem.value
        ),
      }
      : undefined;
  }
  toQueryParams(): FilterType | undefined {
    return this.selectedItems.length > 0
      ? {
        column: this.column,
        comparisonType: "IN",
        value: this.selectedItems.map(
          (selectedItem) => selectedItem.value
        ),
      }
      : undefined;
  }

  //
  async initItems(): Promise<void> {
    this.items = await this.itemListCallback();
  }

  //
  hasSelectedFilter(): boolean {
    return this.selectedItems.length > 0;
  }

  removeSelectedItem(selectedItem: EnumFilterItemType): void {
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
