import { SalesEnumType } from "@/shared-bc/domain/enum/sales-enum-type";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSalesStore = defineStore("sales", () => {
  const allActiveInHouseSalesList = ref<{ id: string; name: string }[]>([]);
  const allActiveInHouseSalesLlistBelongsToManager = ref<
    { id: string; name: string }[]
  >([]);
  const { companyUserRepository, managerRepository } = useDependencyInjection();
  let dataInitialized = false;
  let managerDataInitialized = false;

  async function initialize() {
    const response = await companyUserRepository
      .getUser()!
      .executeGraphqlQueryInCompany<{
        viewAllSales: { id: string; name: string }[];
      }>({
        operation: "viewAllSales",
        variables: {
          filters: {
            type: "[FilterInput]",
            value: [
              { column: "Sales.contractTerminated", value: false },
              { column: "Sales.type", value: SalesEnumType.IN_HOUSE },
            ],
          },
        },
        fields: ["id", "name"],
      });
    allActiveInHouseSalesList.value = response.viewAllSales;
    dataInitialized = true;
  }

  const getAllActiveInHouseSalesList = computed(async () => {
    if (!dataInitialized) {
      await initialize();
    }
    return allActiveInHouseSalesList;
  });

  async function initializeManagerData() {
    const response = await managerRepository
      .getUser()
      .executeManagerGraphqlQuery<{
        viewAllSales: { id: string; name: string }[];
      }>({
        operation: "viewAllSales",
        variables: {
          filters: {
            type: "[FilterInput]",
            value: [
              { column: "Sales.contractTerminated", value: false },
              { column: "Sales.type", value: SalesEnumType.IN_HOUSE },
            ],
          },
        },
        fields: ["id", "name"],
      });
      allActiveInHouseSalesLlistBelongsToManager.value = response.viewAllSales;
    managerDataInitialized = true;
  }

  const getAllActiveInHouseSalesListBelongsToManager = computed(async () => {
    if (!managerDataInitialized) {
      await initializeManagerData();
    }
    return allActiveInHouseSalesLlistBelongsToManager;
  });

  return {
    getAllActiveInHouseSalesList,
    getAllActiveInHouseSalesListBelongsToManager,
  };
});
