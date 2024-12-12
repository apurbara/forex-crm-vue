<template>
  <div class="d-flex justify-end mb-2">
    <v-rating hover :length="3" :size="32" v-model="customer.rating" active-color="primary"
      @click="updateRatingConfirmation($event)" />
    <v-btn v-if="!editingCustomerBio" variant="tonal" @click="editingCustomerBio = true">edit customer</v-btn>
    <v-btn v-else variant="tonal" @click="editingCustomerBio = false">cancel</v-btn>
  </div>
  <div v-if="editingCustomerBio">
    <CustomerEditableComponent :customer="customerAssignment.customer" />
    <div class="d-flex justify-end ma-2">
      <v-btn :disabled="!customerAssignment.customer?.isValidProperties()!" variant="tonal"
        @click="updateCustomer">update</v-btn>
    </div>
  </div>
  <div v-else>
    <CustomerReadonlyComponent :customer="customerAssignment.customer" />
  </div>
</template>

<script setup lang="ts">
import { CustomerType } from '@/company-bc/domain/model/customer';
import CustomerAssignment from '@/sales-bc/domain/model/sales/customer-assignment';
import Customer from '@/sales-bc/domain/model/sales/customer-assignment/customer';
import CustomerEditableComponent from '@/sales-bc/domain/model/sales/customer-assignment/CustomerEditableComponent.vue';
import CustomerReadonlyComponent from '@/sales-bc/domain/model/sales/customer-assignment/CustomerReadonlyComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { useConfirm } from 'primevue/useconfirm';
import { ref } from 'vue';

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const { salesRepository } = useDependencyInjection();

const customer: Customer = props.customerAssignment.customer;
const initialRating = ref(props.customerAssignment.customer.rating);
const editingCustomerBio = ref<boolean>(false);
const confirm = useConfirm();

const updateRatingConfirmation = (event: Event) => {
  console.log(event.currentTarget);
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to update customer rating?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await salesRepository.getUser()!
        .executeSalesGraphqlMutation<{ customerAssignment: { updateCustomerRating: CustomerType } }>({
          operation: "customerAssignment",
          variables: { customerAssignmentId: { type: "ID", value: props.customerAssignment.id } },
          fields: [{
            operation: "updateCustomerRating",
            variables: { rating: props.customerAssignment.customer.rating },
            fields: ["rating"],
          }]
        })
      props.customerAssignment.customer.load(response.customerAssignment.updateCustomerRating);
      initialRating.value = props.customerAssignment.customer.rating;
    },
    reject: () => {
      props.customerAssignment.customer.rating = initialRating.value;
    }
  });
};

const updateCustomer = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ customerAssignment: { updateCustomer: CustomerType } }>({
      operation: "customerAssignment",
      variables: { customerAssignmentId: { type: "ID", value: props.customerAssignment.id } },
      fields: [{
        operation: "updateCustomer",
        variables: props.customerAssignment.customer.toGraphqlVariables(),
        fields: ["name", "email", "bio", { city: ["id", "name"] }],
      }]
    })
  props.customerAssignment.customer?.load(response.customerAssignment.updateCustomer!)
  editingCustomerBio.value = false;
}

</script>

<style lang="scss" scoped></style>