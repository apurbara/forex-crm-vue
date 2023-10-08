export default class EnumFilter {
  // label;
  // placeholder;
  // itemListCallback;
  // items = undefined;
  // itemTitle = "nama";
  // itemValue = "id";
  // selectedItems = [];
  // columns;
  type: string = "ENUM";

  constructor(
    public label: string,
    public placeholder: string = "search",
    public itemListCallback: CallableFunction = () => {},
    public items: Array<{ [key: string]: string }> = [],
    public itemTitle: string = "name",
    public itemValue: string = "id",
    public selectedItems: Array<string> = [],
    public columns: Array<string> = []
  ) {}

  async prepareItems() {
    if (!this.items) {
      this.items = await this.itemListCallback();
    }
  }

  getFilterParameter() {
    if (this.selectedItems.length > 0) {
      const comparisonValues = `('` + this.selectedItems.join("' or '") + `')`;
      let filterParameter = "";
      this.columns.forEach((column) => {
        filterParameter +=
          (filterParameter.length == 0 ? "" : ` or `) +
          `${column}=in=${comparisonValues}`;
      });
      return filterParameter.length > 0 ? `(${filterParameter})` : "";
    } else {
      return "";
    }
  }

  getQueryParameters(): string {
    return "";
  }

  getAppliedFilters(): Array<any> {
    const appliedFilters: Array<{ title: string; value: string }> = [];
    this.selectedItems.forEach((appliedFilterValue) => {
      // console.log('item', this.items)
      const foundItem = this.items.find(
        (item) => item[this.itemValue] === appliedFilterValue
      );
      if (foundItem) {
        appliedFilters.push({
          title: foundItem[this.itemTitle],
          value: appliedFilterValue,
        });
      }
    });
    return appliedFilters;
  }
  removeAppliedFilter(appliedFilterValue: string): void {
    console.log(appliedFilterValue);
    const appliedFilterIndex = this.selectedItems.indexOf(appliedFilterValue);
    if (appliedFilterIndex >= 0) {
      this.selectedItems.splice(appliedFilterIndex, 1);
    }
  }
  resetSelections(): void {
    this.selectedItems.length = 0;
  }

  resetItemSelections(index: number) {
    this.selectedItems.splice(index, 1);
  }
}
