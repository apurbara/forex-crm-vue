import ClosingRequestComponent from
'@/domain/model/personnel/manager/sales/customer-assignment/ClosingRequestComponent.vue';
<template>
  <ClosingRequestComponent :closing-request="closingRequest" />
  <div class="d-flex justify-center">
    <v-btn @click="submitClosingRequest" :disabled="!closingRequest.isValidToSubmit()">submit</v-btn>
  </div>
</template>

<script lang="ts" setup>
import CustomerAssignment from '@/sales-bc/domain-old/model/sales/customer-assignment';
import ClosingRequestComponent from '@/sales-bc/domain-old/model/sales/customer-assignment/ClosingRequestComponent.vue';
import ClosingRequest, { ClosingRequestType } from '@/sales-bc/domain-old/model/sales/customer-assignment/closing-request';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';

const { httpRequest, salesRepository } = useDependencyInjection()
const props = defineProps<{ customerAssignment: CustomerAssignment }>()
const closingRequest = reactive<ClosingRequest>(new ClosingRequest(props.customerAssignment))
const emit = defineEmits(['closingRequestSubmitted'])

const submitClosingRequest = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitClosingRequest: ClosingRequestType }>(httpRequest, {
      operation: "submitClosingRequest",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...closingRequest.toGraphqlVariables()
      },
      fields: ["id", 'status', "createdTime", "transactionValue", "note"]
    })
  closingRequest.load(response.submitClosingRequest)
  props.customerAssignment.addClosingRequest(closingRequest)
  emit('closingRequestSubmitted')
}
</script>

<style lang="scss" scoped></style>