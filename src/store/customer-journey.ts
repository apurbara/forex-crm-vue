import { CustomerJourneyType } from "@/company-bc/domain/model/customer-journey";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCustomerJourneyStore = defineStore('customer-journey', () => {
  const allActiveCustomerJourneyList = ref<CustomerJourneyType[]>([]);
  const { httpRequest, companyUserRepository } = useDependencyInjection();
  let dataInitialized = false;

  async function initialize() {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ viewAllActiveCustomerJourney: CustomerJourneyType[] }>(httpRequest, {
        operation: "viewAllActiveCustomerJourney",
        variables: {},
        fields: ["id", "name", "description"]
      })
    allActiveCustomerJourneyList.value = response.viewAllActiveCustomerJourney;
    dataInitialized = true;
  }

  const getAllActiveCustomerJourneyList = computed(async () => {
    if (!dataInitialized) {
      await initialize();
    }
    return allActiveCustomerJourneyList;
  })

  return { getAllActiveCustomerJourneyList }
})