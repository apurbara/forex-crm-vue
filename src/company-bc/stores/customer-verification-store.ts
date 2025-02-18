import { defineStore } from "pinia";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { ref } from "vue";
import { CustomerVerificationType } from "../domain/model/customer-verification";

export const useCustomerVerificationStore = defineStore("CustomerVerification", () => {
  const allActiveCustomerVerificationList = ref<CustomerVerificationType[]>();
  const isAllActiveCustomerVerificationListFetched = ref(false);

  const { companyUserRepository } = useDependencyInjection();

  async function fecthAllActiveCustomerVerificationList(): Promise<CustomerVerificationType[]> {
    if (!isAllActiveCustomerVerificationListFetched.value) {
      const response = await companyUserRepository.getUser()!.executeGraphqlQueryInCompany<{
        viewAllActiveCustomerVerification: CustomerVerificationType[];
      }>({
        operation: "viewAllActiveCustomerVerification",
        variables: {},
        fields: ["id", "name", "description", "position", "weight"],
      });
      allActiveCustomerVerificationList.value = response.viewAllActiveCustomerVerification;
      isAllActiveCustomerVerificationListFetched.value = true;
    }
    return allActiveCustomerVerificationList.value ?? [];
  }

  return { fecthAllActiveCustomerVerificationList };
});
