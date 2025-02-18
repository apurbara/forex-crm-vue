import { defineStore } from "pinia";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { ref } from "vue";
import { SalesActivityType } from "../domain/model/sales-activity";

export const useSalesActivityStore = defineStore("SalesActivity", () => {
  const allActiveSalesActivityList = ref<SalesActivityType[]>();
  const isAllActiveSalesActivityListFetched = ref(false);

  const { companyUserRepository } = useDependencyInjection();

  async function fecthAllActiveSalesActivityList(): Promise<SalesActivityType[]> {
    if (!isAllActiveSalesActivityListFetched.value) {
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{ viewAllActiveSalesActivityList: SalesActivityType[] }>({
          operation: "viewAllActiveSalesActivityList",
          variables: {
            filters: {
              type: "[FilterInput]",
              value: [{ column: "SalesActivity.disabled", value: false }],
            },
          },
          fields: ["id", "name", "description", "initial"],
        });
      allActiveSalesActivityList.value = response.viewAllActiveSalesActivityList;
      isAllActiveSalesActivityListFetched.value = true;
    }
    return allActiveSalesActivityList.value ?? [];
  }

  return { fecthAllActiveSalesActivityList };
});
