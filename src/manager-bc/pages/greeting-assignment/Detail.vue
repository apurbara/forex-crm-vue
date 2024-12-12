<template>
  <div class="d-flex justify-space-between">
    <h1 class="page-title">{{ greetingAssignment?.customer?.name }}</h1>
    <div class="d-flex justify-space-between">
      <div class="mt-2 mr-2">greeter:</div>
      <h1 class="page-title">{{ greetingAssignment?.sales?.name }}</h1>
    </div>
  </div>
  <div>
    <section class="page-section ma-2">
      <DetailCustomerSection :customer="greetingAssignment?.customer!" />
    </section>
  </div>
  <div>
    <DetailSalesActivityLogSection :customer-assignment="greetingAssignment!" />
  </div>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, ref } from 'vue';
import { GreetingAssignmentType } from '@/company-bc/domain/model/manager/sales/greeting-assignment';
import DetailSalesActivityLogSection from '../customer-assignment/DetailSalesActivityLogSection.vue';
import DetailCustomerSection from '../customer-assignment/DetailCustomerSection.vue';

const props = defineProps<{ greetingAssignmentId: string }>()
var greetingAssignment = ref<GreetingAssignmentType>();
const { managerRepository } = useDependencyInjection()

onMounted(async () => {
  const response = await managerRepository.getUser()
    .executeManagerGraphqlQuery<{ greetingAssignmentDetail: GreetingAssignmentType }>({
      operation: "greetingAssignmentDetail",
      variables: { id: { type: 'ID', required: true, value: props.greetingAssignmentId } },
      fields: [
        'id', 'status', 'createdTime',
        { sales: ["name"] },
        {
          customer: [
            'name', "email", "phone", "rating", "source",
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
  greetingAssignment.value = response.greetingAssignmentDetail;
})

</script>

<style scoped></style>