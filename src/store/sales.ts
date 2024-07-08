import { SalesEnumType } from "@/shared-bc/domain/enum/sales-enum-type";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSalesStore = defineStore('sales', () => {
  const allActiveInHouseSalesList = ref<{ id: string, name: string }[]>([]);
  const { httpRequest, companyUserRepository } = useDependencyInjection();
  let dataInitialized = false;

  async function initialize() {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ viewAllSales: { id: string, name: string }[] }>(httpRequest, {
        operation: "viewAllSales",
        variables: {
          filters: {
            type: "[FilterInput]", value: [
              { column: "Sales.cancelled", value: false },
              { column: "Sales.type", value: SalesEnumType.IN_HOUSE },
            ]
          }
        },
        fields: ["id", "name"]
      })
    allActiveInHouseSalesList.value = response.viewAllSales;
    dataInitialized = true;
  }

  const getAllActiveInHouseSalesList = computed(async () => {
    if (!dataInitialized) {
      await initialize();
    }
    return allActiveInHouseSalesList;
  })

  return { getAllActiveInHouseSalesList }
})