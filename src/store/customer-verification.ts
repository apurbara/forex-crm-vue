import { CustomerVerificationType } from "@/company-bc/domain/model/customer-verification";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCustomerVerificationStore = defineStore(
  "customer-verification",
  () => {
    const allActiveCustomerVerificationList = ref<CustomerVerificationType[]>(
      []
    );
    const { companyUserRepository } = useDependencyInjection();
    let dataInitialized = false;

    async function initialize() {
      const response = await companyUserRepository
        .getUser()!
        .executeGraphqlQueryInCompany<{
          viewAllActiveCustomerVerification: CustomerVerificationType[];
        }>({
          operation: "viewAllActiveCustomerVerification",
          variables: {},
          fields: ["id", "name", "description", "position", "weight"],
        });
      allActiveCustomerVerificationList.value =
        response.viewAllActiveCustomerVerification;
      dataInitialized = true;
    }

    const getAllActiveCustomerVerificationList = computed(async () => {
      if (!dataInitialized) {
        await initialize();
      }
      return allActiveCustomerVerificationList;
    });

    const getActiveCustomerVerification = computed(async (id: string) => {
      if (!dataInitialized) {
        await initialize();
      }
      return allActiveCustomerVerificationList.value.find(
        (customerVerification) => customerVerification.id === id
      );
    });

    return {
      getAllActiveCustomerVerificationList,
      getActiveCustomerVerification,
    };
  }
);
