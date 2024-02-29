<template>
  <div class="page-section ma-2">
    <div class="d-flex justify-space-between">
      <h2 class="section-title">Customer Verification</h2>
      <v-chip>{{ assignedCustomer.customer.countTotalVerifiedReportWeight() }}</v-chip>
    </div>
    <div v-if="assignedCustomer.customer.getVerifiedReportList().length > 0" class="ma-4">
      <ul>
        <li v-for="(verificationReport, index) in assignedCustomer.customer.getVerifiedReportList()"
          :key="verificationReport.id ?? index">
          {{ verificationReport.customerVerification.label.name }} {{ verificationReport.note ? `:
          ${verificationReport.note}` : `` }}
        </li>
      </ul>
    </div>
    <v-table density="compact" style="width: 100%;" class="datatable px-2"
      v-if="assignedCustomer.customer.getUnverifiedReportList().length > 0">
      <thead>
        <tr>
          <th>desciption</th>
          <th>bobot</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(verificationReport, index) in assignedCustomer.customer.getUnverifiedReportList()"
          :key="verificationReport.id ?? index">
          <td>
            <p class="font-14">{{ limitString(verificationReport.customerVerification.label.name, 30) }}</p>
            <p class="font-12">{{ limitString(verificationReport.customerVerification.label.description, 40) }}</p>
          </td>
          <td>
            <p class="font-14">{{ verificationReport.customerVerification.weight}}</p>
          </td>
          <td>
            <v-btn variant="text" icon="mdi-cloud-upload-outline" size="small"
              @click="showVerificationReportSubmission(verificationReport)"></v-btn>
            <v-btn variant="text" icon="mdi-check-circle-outline" size="small"
              @click="submitVerificationWithoutNote(verificationReport)"></v-btn>
            <!-- <v-btn v-if="verificationReport.id" variant="text" icon="mdi-note-check-outline" size="small"
              @click="showVerificationNote($event, verificationReport)"></v-btn> -->
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <OverlayPanel ref="op" showCloseIcon style="width: 600px;">
    <div class="pa-4">{{ opMessage }}</div>
  </OverlayPanel>


  <v-dialog v-model="displayVerificationReportSubmissionDialog" location-strategy="connected" width="600px">
    <div style="background-color: white; border-radius: 4px;" class="pa-8">
      <SubmitVerificationReportComponent :verification-report="toSubmitVerificationReport!">
      </SubmitVerificationReportComponent>
      <div class="d-flex justify-end">
        <v-btn @click="submitVerificationReport">submit</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts" setup>
import SubmitVerificationReportComponent from '@/domain/model/customer/SubmitVerificationReportComponent.vue';
import VerificationReport, { VerificationReportType } from '@/domain/model/customer/verification-report';
import AssignedCustomer from '@/domain/model/personnel/manager/sales/assigned-customer';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ref } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';
import { useStringLimiter } from '@/resources/composables/typography';

const props = defineProps<{ assignedCustomer: AssignedCustomer }>()
const { httpRequest, userRepository } = useDependencyInjection()

const toSubmitVerificationReport = ref<VerificationReport>()
const displayVerificationReportSubmissionDialog = ref<boolean>(false)
const verifiedReportCount = ref<number>(props.assignedCustomer.customer.getVerifiedReportList().length)
const op = ref()
const opMessage = ref()

const showVerificationReportSubmission = (verificationReport: VerificationReport) => {
  toSubmitVerificationReport.value = verificationReport
  displayVerificationReportSubmissionDialog.value = true
}
const verificationReportNote = ref<string>("")

const submitVerificationReport = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ submitCustomerVerificationReport: VerificationReportType }>(httpRequest, {
      operation: "submitCustomerVerificationReport",
      variables: {
        AssignedCustomer_id: { type: "ID", required: true, value: props.assignedCustomer.id },
        CustomerVerification_id: { type: "ID", required: true, value: toSubmitVerificationReport.value?.customerVerification.id },
        ...toSubmitVerificationReport.value?.toGraphqlVariables()
      },
      fields: ["id", "note", "createdTime"],
    })
  toSubmitVerificationReport.value?.load(response.submitCustomerVerificationReport)
  displayVerificationReportSubmissionDialog.value = false
}

const submitVerificationWithoutNote = async (verificationReport: VerificationReport) => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ submitCustomerVerificationReport: VerificationReportType }>(httpRequest, {
      operation: "submitCustomerVerificationReport",
      variables: {
        AssignedCustomer_id: { type: "ID", required: true, value: props.assignedCustomer.id },
        CustomerVerification_id: { type: "ID", required: true, value: verificationReport.customerVerification.id },
        ...verificationReport.toGraphqlVariables()
      },
      fields: ["id", "note", "createdTime"],
    })
  verificationReport.load(response.submitCustomerVerificationReport)
}

const limitString = (string: string | undefined, length: number) => {
  return useStringLimiter(string, length)
}

const showVerificationNote = (event: any, verificationReport: VerificationReport) => {
  op.value.toggle(event);
  opMessage.value = verificationReport.note
}
</script>

<style lang="scss" scoped></style>