import { defineStore } from "pinia";
import { CityType } from "../domain/model/province/city";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { ref } from "vue";

export const useCityStore = defineStore("city", () => {
  const allActiveCityList = ref<CityType[]>();
  const isAllActiveCityListFetched = ref(false);

  const { companyUserRepository } = useDependencyInjection();

  async function fecthAllActiveCityList(): Promise<CityType[]> {
    if (!isAllActiveCityListFetched.value) {
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{ viewAllCity: CityType[] }>({
          operation: "viewAllCity",
          variables: {
            filters: { type: "[FilterInput]", value: [{ column: "City.disabled", value: false }] },
          },
          fields: ["id", "name"],
        });
      allActiveCityList.value = response.viewAllCity;
      isAllActiveCityListFetched.value = true;
    }
    return allActiveCityList.value ?? [];
  }

  return { fecthAllActiveCityList };
});
