export default class Sorting {
  // sortBy;
  // direction;

  constructor(
    public sortBy: string | undefined = undefined,
    public direction: string = "asc"
  ) {
    // this.sortBy = data.sortBy;
    // this.direction = data.direction;
  }

  initSort(column: string) {
    this.sortBy = column;
    this.direction = "asc";
  }
  swapDirection() {
    this.direction = this.direction === "desc" ? "asc" : "desc";
  }
}
