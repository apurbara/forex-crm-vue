<template>
  <v-rating hover :length="3" :size="32" v-model="customer.rating" active-color="primary"
    @click="updateRatingConfirmation($event)" />
  <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.phone, icon: `mdi-phone-classic` }" />
  <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.email, icon: `mdi-email-outline` }" />
  <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.city?.name, icon: `mdi-map-marker-outline` }" />
  <InfoComponentIcon style="min-width: 40%;" :info="{ value: customer.source, icon: `mdi-account-group-outline` }" />
</template>

<script setup lang="ts">
import { CustomerType } from '@/company-bc/domain/model/customer';
import CustomerAssignment from '@/sales-bc/domain/model/sales/customer-assignment';
import Customer from '@/sales-bc/domain/model/sales/customer-assignment/customer';
import InfoComponentIcon from '@/shared/components/info-componentIcon.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { useConfirm } from 'primevue/useconfirm';
import { onMounted, ref } from 'vue';

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const customer: Customer = props.customerAssignment.customer;
const initialRating = ref(props.customerAssignment.customer.rating);
const confirm = useConfirm();
const { salesRepository, companyUserRepository } = useDependencyInjection();

const updateRatingConfirmation = (event: Event) => {
  console.log(event.currentTarget);
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to update customer rating?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await salesRepository.getUser()!
        .executeSalesGraphqlMutation<{ updateCustomerRating: CustomerType }>({
          operation: "updateCustomerRating",
          variables: {
            rating: props.customerAssignment.customer.rating,
            CustomerAssignment_id: { type: "ID", value: props.customerAssignment.id },
          },
          fields: ['rating']
        });
      props.customerAssignment.customer.load(response.updateCustomerRating);
      initialRating.value = props.customerAssignment.customer.rating;
    },
    reject: () => {
      props.customerAssignment.customer.rating = initialRating.value;
    }
  });
};

</script>

<style lang="scss" scoped></style>