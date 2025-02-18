import { defineStore } from "pinia";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { ref } from "vue";
import CustomerAssignment from "../domain/model/sales/customer-assignment";
import CustomerAssignmentService from "../domain/service/customer-assignment-service";

export const useCustomerAssignmentStore = defineStore("CustomerAssignment", () => {
  const { salesRepository } = useDependencyInjection();
  const customerAssignmentService = new CustomerAssignmentService(salesRepository.getUser());
  const cachedCustomerAssignment = ref<CustomerAssignment>();

  const getCustomerAssignment = async (id: string) => {
    if (cachedCustomerAssignment.value?.id !== id) {
      cachedCustomerAssignment.value = new CustomerAssignment();
      const data = await customerAssignmentService.customerAssignmentDetail(id);
      cachedCustomerAssignment.value.load(data);
    }
    return cachedCustomerAssignment.value;
  };

  return { getCustomerAssignment };
});
