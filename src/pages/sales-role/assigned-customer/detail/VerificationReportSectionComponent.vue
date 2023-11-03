<template>
  <div class="page-section">
    <h2 class="section-title">Customer Verification</h2>
    <div class="card-list">
      <ItemCardComponent class="card-list__item"
        v-for="(verificationReport, key) in assignedCustomer.customer.verificationReports" :key="key" :item="{
          name: verificationReport.customerVerification.label.name,
          description: verificationReport.customerVerification.label.description,
        }">
        <template v-slot>
          <div class="d-flex justify-end">
            <v-btn class="mr-4" v-if="verificationReport.id"
              @click="showVerificationNote($event, verificationReport)">note</v-btn>
            <v-btn @click="showVerificationReportSubmission(verificationReport)">verify</v-btn>
          </div>
        </template>
      </ItemCardComponent>
    </div>
  </div>

  <OverlayPanel ref="op">
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
import ItemCardComponent from '@/shared/components/item-card-component.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ref } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';

const props = defineProps<{ assignedCustomer: AssignedCustomer }>()
const { httpRequest, userRepository } = useDependencyInjection()

const toSubmitVerificationReport = ref<VerificationReport>()
const displayVerificationReportSubmissionDialog = ref<boolean>(false)
const op = ref()
const opMessage = ref()

const showVerificationReportSubmission = (verificationReport: VerificationReport) => {
  toSubmitVerificationReport.value = verificationReport
  displayVerificationReportSubmissionDialog.value = true
}
const verificationReportNote = ref<string>("")

const submitVerificationReport = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ assignedCustomer: { submitCustomerVerificationReport: VerificationReportType } }>(httpRequest, {
      operation: "assignedCustomer",
      variables: { assignedCustomerId: { type: "ID", required: true, value: props.assignedCustomer.id } },
      fields: [{
        operation: "submitCustomerVerificationReport",
        variables: {
          customerVerificationId: { type: "ID", required: true, value: toSubmitVerificationReport.value?.customerVerification.id },
          ...toSubmitVerificationReport.value?.toGraphqlVariables()
        },
        fields: ["id", "note", "createdTime"]
      }],
    })
  toSubmitVerificationReport.value?.load(response.assignedCustomer.submitCustomerVerificationReport)
  displayVerificationReportSubmissionDialog.value = false
}

const showVerificationNote = (event:any, verificationReport: VerificationReport) => {
  op.value.toggle(event);
  opMessage.value = verificationReport.note
}
</script>

<style lang="scss" scoped></style>