<template>
  <div>
    <h1 class="page-title">Assigned Customer Detail</h1>
    <PersonCardComponent style="width: 25%;" :person="{
      name: assignedCustomer.customer.name,
      bio: assignedCustomer.customer.email
    }">
      <v-chip color="primary">{{ assignedCustomer.customer.area.label.name }}</v-chip>
    </PersonCardComponent>

    <VerificationReportSectionComponent :assigned-customer="assignedCustomer" />

    <SalesActivityScheduleSectionComponent :assigned-customer="assignedCustomer" />

    <div class="page-section">
      <h2 class="section-title">Closing Requests</h2>
      <div class="card-list">
        <v-card class="card-list__item" v-for="(closingRequest, key) in assignedCustomer.closingRequests">
          <v-card-title>{{ closingRequest.transactionValue }}</v-card-title>
          <v-card-subtitle>{{ closingRequest.note }}</v-card-subtitle>
          <v-card-item>
            <v-chip color="success">{{ closingRequest.status }}</v-chip>
            <p>created time: {{ closingRequest.createdTime }}</p>
          </v-card-item>
        </v-card>
      </div>
    </div>
    
    <div class="page-section">
      <h2 class="section-title">Recycle Requests</h2>
      <div class="card-list">
        <v-card class="card-list__item" v-for="(recycleRequest, key) in assignedCustomer.recycleRequests">
          <v-card-subtitle>{{ recycleRequest.note }}</v-card-subtitle>
          <v-card-item>
            <v-chip color="success">{{ recycleRequest.status }}</v-chip>
            <p>created time: {{ recycleRequest.createdTime }}</p>
          </v-card-item>
        </v-card>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { CustomerVerificationType } from '@/domain/model/customer-verification';
import AssignedCustomer, { AssignedCustomerType } from '@/domain/model/personnel/manager/sales/assigned-customer';
import SalesActivitySchedule from '@/domain/model/personnel/manager/sales/assigned-customer/sales-activity-schedule';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { PaginationResponseType } from '@/resources/components/abstract-pagination';
import CursorPagination from '@/resources/components/cursor-pagination';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import VerificationReportSectionComponent from './detail/VerificationReportSectionComponent.vue';
import SalesActivityScheduleSectionComponent from './detail/SalesActivityScheduleSectionComponent.vue';
import ItemCardComponent from '@/shared/components/item-card-component.vue';

const { httpRequest, userRepository, cache } = useDependencyInjection()

const assignedCustomer = reactive(new AssignedCustomer())
const props = defineProps<{ assignedCustomerId: string }>()

const newActivitySchedule = ref<SalesActivitySchedule>(assignedCustomer.planNewSchedule())
const showAddNewSchedule = ref<boolean>(false)

onMounted(async () => {

  const customerVerificationResponse = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlQueryInCompany<{ customerVerificationList: PaginationResponseType<CustomerVerificationType> }>(httpRequest, {
      operation: "customerVerificationList",
      variables: { filters: { type: "[FilterInput]", value: [{ column: 'CustomerVerification.disabled', value: false }] } },
      fields: CursorPagination.wrapResultFields(["id", "name", "description"])
    })
  assignedCustomer.customer.registerCustomerVerificationReports(customerVerificationResponse.customerVerificationList.list)

  const cacheData = cache?.pull<AssignedCustomerType>(`assigned-customer-${props.assignedCustomerId}`);
  if (cacheData) {
    assignedCustomer.load(cacheData);
  } else {
    const response = await userRepository?.getUser<SalesRole>()
      .executeSalesGraphqlQuery<{ assignedCustomerDetail: AssignedCustomerType }>(httpRequest, {
        operation: 'assignedCustomerDetail',
        variables: { assignedCustomerId: { type: 'ID', required: true, value: props.assignedCustomerId } },
        fields: [
          'id', 'disabled', 'createdTime',
          {
            customer: [
              "id", "name", "email",
              { area: ["name"] },
              { verificationReports: CursorPagination.wrapResultFields(["id", "CustomerVerification_id", "note", "createdTime"]) },
            ]
          },
          {
            schedules: CursorPagination.wrapResultFields([
              "id", "startTime", "endTime",
              { salesActivity: ["name", "description", "duration", "initial", "disabled"] },
              { salesActivityReport: ["id", "submitTime", "content"] },
            ])
          },
          {
            closingRequests: CursorPagination.wrapResultFields(["id", "status", "createdTime", "transactionValue", "note"])
          },
          {
            recycleRequests: CursorPagination.wrapResultFields(["id", "status", "createdTime", "note"])
          },
        ],
      })
    assignedCustomer.load(response.assignedCustomerDetail)
  }
})

</script>

<style lang="scss" scoped></style>