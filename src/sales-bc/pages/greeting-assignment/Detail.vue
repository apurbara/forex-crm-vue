<template>
  <h1 class="page-title">{{ greetingAssignment.customerAssignment.customer.name }}</h1>
  <div class="d-flex">
    <div class="flex-grow-1 flex-shrink-0">
      <DetailSalesActivityLogSection :customer-assignment="greetingAssignment.customerAssignment" />
    </div>
    <section class="page-section ma-2" style="width: 35%;">
      <DetailCustomerSection :customer-assignment="greetingAssignment.customerAssignment" />
      <div class="d-flex justify-end">
        <div class="px-2">
          <v-btn variant="tonal" @click="recycleCustomer" :disabled="processingValidationRequest">recycle</v-btn>
        </div>
        <div class="px-2">
          <v-btn variant="tonal" @click="validateCustomer" :disabled="processingValidationRequest">validate</v-btn>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';
import GreetingAssignment from '@/sales-bc/domain/model/sales/greeting-assignment';
import { GreetingAssignmentType } from '@/company-bc/domain/model/manager/sales/greeting-assignment';
import { useRouter } from 'vue-router'
import DetailSalesActivityLogSection from '../customer-assignment/DetailSalesActivityLogSection.vue';
import DetailCustomerSection from '../customer-assignment/DetailCustomerSection.vue';

const props = defineProps<{ greetingAssignmentId: string }>()
const greetingAssignment = reactive(new GreetingAssignment());
const { salesRepository, httpRequest } = useDependencyInjection()

const router = useRouter()

onMounted(async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<{ greetingAssignmentDetail: GreetingAssignmentType }>({
      operation: "greetingAssignmentDetail",
      variables: { id: { type: 'ID', required: true, value: props.greetingAssignmentId } },
      fields: [
        'id', 'status', 'createdTime',
        {
          customer: [
            'name', "email", "phone", "rating", "source", "bio",
            { city: ["id", "name"] },
          ]
        },
        {
          salesActivitySchedules: [
            "id", "startTime", "endTime", "status",
            { salesActivity: ["name", "description", "duration", "initial", "disabled"] },
            { salesActivityReport: ["id", "submitTime", "content"] },
          ]
        },
      ],
    });
  greetingAssignment.load(response.greetingAssignmentDetail);
})

const processingValidationRequest = ref<boolean>(false);
const validateCustomer = async () => {
  processingValidationRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ validateCustomer: GreetingAssignmentType }>({
      operation: "validateCustomer",
      variables: {
        id: { type: "ID", required: true, value: greetingAssignment.customerAssignment.id },
      },
      fields: ['status']
    })
  processingValidationRequest.value = false;
  router.push({ path: '/sales-greeting-assignment' })
}
const recycleCustomer = async () => {
  processingValidationRequest.value = true;
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ recycleCustomer: GreetingAssignmentType }>({
      operation: "recycleCustomer",
      variables: {
        id: { type: "ID", required: true, value: greetingAssignment.customerAssignment.id },
      },
      fields: ['status']
    })
  processingValidationRequest.value = false;
  router.push({ path: '/sales-greeting-assignment' })
}

</script>

<style scoped></style>