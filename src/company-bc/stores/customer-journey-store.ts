import { defineStore } from "pinia";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { ref } from "vue";
import { CustomerJourneyType } from "../domain/model/customer-journey";

export const useCustomerJourneyStore = defineStore("CustomerJourney", () => {
  const allCustomerJourneyList = ref<CustomerJourneyType[]>();
  const allActiveCustomerJourneyList = ref<CustomerJourneyType[]>();
  const isAllActiveCustomerJourneyListFetched = ref(false);

  const { companyUserRepository } = useDependencyInjection();

  async function fecthAllActiveCustomerJourneyList(): Promise<CustomerJourneyType[]> {
    if (!isAllActiveCustomerJourneyListFetched.value) {
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{ viewAllActiveCustomerJourney: CustomerJourneyType[] }>({
          operation: "viewAllActiveCustomerJourney",
          variables: {
            filters: {
              type: "[FilterInput]",
              value: [{ column: "CustomerJourney.disabled", value: false }],
            },
          },
          fields: ["id", "initial", "name", "description"],
        });
      allActiveCustomerJourneyList.value = response.viewAllActiveCustomerJourney;
      isAllActiveCustomerJourneyListFetched.value = true;
    }
    return allActiveCustomerJourneyList.value ?? [];
  }

  async function fecthAllCustomerJourneyList(): Promise<CustomerJourneyType[]> {
    if (!isAllActiveCustomerJourneyListFetched.value) {
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{ viewAllActiveCustomerJourney: CustomerJourneyType[] }>({
          operation: "viewAllActiveCustomerJourney",
          variables: {},
          fields: ["id", "initial", "name", "description"],
        });
      allActiveCustomerJourneyList.value = response.viewAllActiveCustomerJourney;
      isAllActiveCustomerJourneyListFetched.value = true;
    }
    return allActiveCustomerJourneyList.value ?? [];
  }

  const findCustomerJourneyById = async (id: string): Promise<CustomerJourneyType | undefined> => {
    return await fecthAllCustomerJourneyList().then((customerJourneyList) =>
      customerJourneyList.find((customerJourney) => customerJourney.id === id)
    );
  };

  return {
    fecthAllActiveCustomerJourneyList,
    fecthAllCustomerJourneyList,
    findCustomerJourneyById,
  };
});
