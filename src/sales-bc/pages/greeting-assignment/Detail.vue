<template>
  <h1 class="page-title">{{ greetingAssignment.customerAssignment.customer.name }}</h1>
  <div>
    <div class="d-flex justify-end mb-2">
      <v-btn v-if="!editingCustomerBio" variant="tonal" @click="editingCustomerBio = true">edit customer</v-btn>
      <v-btn v-else variant="tonal" @click="editingCustomerBio = false">cancel</v-btn>
    </div>
    <section v-if="editingCustomerBio" class="page-section ma-2">
      <CustomerEditableComponent :customer="greetingAssignment.customerAssignment.customer" />
      <v-btn :disabled="!greetingAssignment.customerAssignment.customer?.isValidProperties()!" variant="tonal"
        @click="updateCustomerBio">update</v-btn>
    </section>
    <section v-else class="page-section ma-2">
      <DetailCustomerSection :customer-assignment="greetingAssignment.customerAssignment" />
      <div class="d-flex justify-end">
        <div class="px-2">
          <v-btn variant="tonal" @click="recycleCustomer">recycle</v-btn>
        </div>
        <div class="px-2">
          <v-btn variant="tonal" @click="validateCustomer">validate</v-btn>
        </div>
      </div>
    </section>
  </div>
  <div>
    <DetailSalesActivityLogSection :customer-assignment="greetingAssignment.customerAssignment" />
  </div>
</template>

<script setup lang="ts">
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';
import GreetingAssignment from '@/sales-bc/domain/model/sales/greeting-assignment';
import { GreetingAssignmentType } from '@/company-bc/domain/model/manager/sales/greeting-assignment';
import CustomerEditableComponent from '@/sales-bc/domain/model/sales/customer-assignment/CustomerEditableComponent.vue';
import CustomerReadonlyComponent from '@/sales-bc/domain/model/sales/customer-assignment/CustomerReadonlyComponent.vue';
import { useRouter } from 'vue-router'
import DetailSalesActivityLogSection from '../customer-assignment/DetailSalesActivityLogSection.vue';
import DetailCustomerSection from '../customer-assignment/DetailCustomerSection.vue';

const props = defineProps<{ greetingAssignmentId: string }>()
const greetingAssignment = reactive(new GreetingAssignment());
const { salesRepository, httpRequest } = useDependencyInjection()

const router = useRouter()
const editingCustomerBio = ref<boolean>(false);

onMounted(async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<{ greetingAssignmentDetail: GreetingAssignmentType }>({
      operation: "greetingAssignmentDetail",
      variables: { id: { type: 'ID', required: true, value: props.greetingAssignmentId } },
      fields: [
        'id', 'status', 'createdTime',
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
  greetingAssignment.load(response.greetingAssignmentDetail);
})

const updateCustomerBio = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ updateCustomerBio: GreetingAssignmentType }>({
      operation: "updateCustomerBio",
      variables: {
        id: { type: "ID", required: true, value: greetingAssignment.customerAssignment.id },
        customer: {
          type: "CustomerInput", value: greetingAssignment.customerAssignment.customer?.toGraphqlVariables()
        },
      },
      fields: [{ customer: ["name", "email", { city: ["id", "name"] }] }]
    })
  greetingAssignment.customerAssignment.customer?.load(response.updateCustomerBio.customer!)
  editingCustomerBio.value = false;
}

const validateCustomer = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ validateCustomer: GreetingAssignmentType }>({
      operation: "validateCustomer",
      variables: {
        id: { type: "ID", required: true, value: greetingAssignment.customerAssignment.id },
      },
      fields: ['status']
    })
  router.push({ path: '/sales-greeting-assignment' })
}

const recycleCustomer = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ recycleCustomer: GreetingAssignmentType }>({
      operation: "recycleCustomer",
      variables: {
        id: { type: "ID", required: true, value: greetingAssignment.customerAssignment.id },
      },
      fields: ['status']
    })
  router.push({ path: '/sales-greeting-assignment' })
}

</script>

<style scoped></style>