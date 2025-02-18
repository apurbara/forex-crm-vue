import SalesRole from "@/sales-bc/role/sales-role";

export default abstract class AbstractSalesService {
  constructor(protected sales: SalesRole) {}
}
