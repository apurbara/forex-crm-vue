<template>
  <h1 class="page-title">Customer Assignment Detail</h1>
  <div class="d-flex flex-wrap">
    <section class="page-section">Customer Info
      <IconAndInfoComponent :info="{ value: customerAssignment.customer?.name, icon: 'mdi-account-tie' }" />
      <IconAndInfoComponent :info="{ value: customerAssignment.customer?.phone, icon: 'mdi-phone' }" />
      <IconAndInfoComponent :info="{ value: customerAssignment.customer?.email, icon: 'mdi-email' }" />
      <IconAndInfoComponent :info="{ value: customerAssignment.customer?.source, icon: 'mdi-facebook' }" />
      <IconAndInfoComponent :info="{ value: customerAssignment.customer?.area?.label.name, icon: 'mdi-map-marker' }" />
      <div v-if="customerAssignment.customer?.verificationReports.length ?? 0 > 0">
        <h3>Verification Reports: <v-badge left color="primary" inline>{{
          customerAssignment.customer?.countVerificationReportScore() }}</v-badge></h3>
        <p v-for="(verificationReport, index) in customerAssignment.customer?.verificationReports" :key="index">
          {{ verificationReport.customerVerification?.label.name }} {{ verificationReport.note ? `:
          ${verificationReport.note}` : `` }}
        </p>
      </div>
    </section>
    <section class="page-section">Sales Info
      <IconAndInfoComponent v-if="customerAssignment.sales?.cancelled"
        :info="{ value: 'cancelled', icon: 'mdi-close-octagon-outline' }" />
      <IconAndInfoComponent :info="{ value: customerAssignment.sales?.accountInfo.name, icon: 'mdi-account-tie' }" />
      <IconAndInfoComponent :info="{ value: customerAssignment.sales?.accountInfo.email, icon: 'mdi-email' }" />
      <IconAndInfoComponent :info="{ value: customerAssignment.sales?.type, icon: 'mdi-city-variant-outline' }" />
    </section>
    <section class="page-section">Progress
      <IconAndInfoComponent :info="{ value: customerAssignment.status, icon: 'mdi-city-variant-outline' }" />
      <IconAndInfoComponent
        :info="{ value: customerAssignment.customerJourney?.label.name, icon: 'mdi-filter-outline' }" />
      <IconAndInfoComponent
        :info="{ value: new Date(customerAssignment.createdTime!).toLocaleTimeString(), icon: 'mdi-clock-time-four-outline' }" />
    </section>
  </div>
  <section class="page-section">Activity Log
    <v-table v-if="customerAssignment.salesActivitySchedules.length > 0" density="compact" style="width: 100%;"
      class="datatable px-2">
      <thead>
        <tr>
          <th>sales activity</th>
          <th>activity time</th>
          <th>report note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(activitySchedule, key) in customerAssignment.salesActivitySchedules"
          :key="activitySchedule.id ?? key">
          <td>{{ activitySchedule.salesActivity?.label.name }}</td>
          <td>{{ new Date(activitySchedule.startTime!).toLocaleString() }}</td>
          <td>{{ activitySchedule.salesActivityReport?.content }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>
  <section class="page-section">Closing Request Log
    <v-table v-if="customerAssignment.closingRequests.length > 0" density="compact" style="width: 100%;"
      class="datatable px-2">
      <thead>
        <tr>
          <th>transaction value</th>
          <th>note</th>
          <th>remark</th>
          <th>status</th>
          <th>submitTime</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(closingRequest, key) in customerAssignment.closingRequests" :key="closingRequest.id ?? key">
          <td>{{ closingRequest.transactionValue }}</td>
          <td>{{ closingRequest.note }}</td>
          <td>{{ closingRequest.remark }}</td>
          <td>{{ closingRequest.status }}</td>
          <td>{{ new Date(closingRequest.createdTime!).toLocaleTimeString() }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>
  <section class="page-section">Recycle Request Log
    <v-table v-if="customerAssignment.recycleRequests.length > 0" density="compact" style="width: 100%;"
      class="datatable px-2">
      <thead>
        <tr>
          <th>note</th>
          <th>remark</th>
          <th>status</th>
          <th>submitTime</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(recycleRequest, key) in customerAssignment.recycleRequests" :key="recycleRequest.id ?? key">
          <td>{{ recycleRequest.note }}</td>
          <td>{{ recycleRequest.remark }}</td>
          <td>{{ recycleRequest.status }}</td>
          <td>{{ new Date(recycleRequest.createdTime!).toLocaleTimeString() }}</td>
        </tr>
      </tbody>
    </v-table>

  </section>
</template>

<script setup lang="ts">
import { CustomerAssignmentType } from '@/company-bc/domain/model/sales/customer-assignment';
import IconAndInfoComponent from '@/shared/components/IconAndInfoComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';

const customerAssignment = reactive<CustomerAssignmentType>({})
const props = defineProps<{ customerAssignmentId: string }>()
const { httpRequest, companyUserRepository } = useDependencyInjection()

onMounted(async () => {
  const response = await companyUserRepository.getUser()
    .executeGraphqlQueryInCompany<{ customerAssignmentDetail: CustomerAssignmentType }>(httpRequest, {
      operation: "customerAssignmentDetail",
      variables: { id: { type: "ID", value: props.customerAssignmentId } },
      fields: [
        "status", "createdTime",
        { customerJourney: ["initial", "name", "description"] },
        {
          customer: [
            "name", "phone", "email", "source",
            { area: ["name"] },
            { verificationReports: ["note", { customerVerification: ["disabled", "name", "weight", "position"] }] },
          ]
        },
        { sales: ["name", "email", "type", "cancelled"] },
        {
          salesActivitySchedules: [
            "status", "startTime", "endTime", "createdTime",
            { salesActivity: ["name", "description", "initial", "duration"] },
            { salesActivityReport: ["submitTime", "content"] },
          ]
        },
        { closingRequests: ["createdTime", "status", "transactionValue", "note", "remark"] },
        { recycleRequests: ["createdTime", "status", "note", "remark"] },
      ]
    })
  customerAssignment.load(response.customerAssignmentDetail)
})

</script>

<style scoped></style>