
import ClosingRequestComponent from '@/domain/model/personnel/manager/sales/assigned-customer/ClosingRequestComponent.vue';
<template>
  <ClosingRequestComponent :closing-request="closingRequest" />
  <div class="d-flex justify-center">
    <v-btn @click="submit" :disabled="!closingRequest.isValidToSubmit()">submit</v-btn>
  </div>
</template>

<script lang="ts" setup>
import AssignedCustomer from '@/domain/model/personnel/manager/sales/assigned-customer';
import ClosingRequestComponent from '@/domain/model/personnel/manager/sales/assigned-customer/ClosingRequestComponent.vue';
import ClosingRequest, { ClosingRequestType } from '@/domain/model/personnel/manager/sales/assigned-customer/closing-request';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';

const { httpRequest, userRepository } = useDependencyInjection()
const props = defineProps<{ assignedCustomer: AssignedCustomer }>()
const closingRequest = reactive<ClosingRequest>(new ClosingRequest(props.assignedCustomer))

const submit = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ assignedCustomer: { submitClosingRequest: ClosingRequestType } }>(httpRequest, {
      operation: "assignedCustomer",
      variables: { assignedCustomerId: { type: "ID", required: true, value: props.assignedCustomer.id } },
      fields: [{
        operation: "submitClosingRequest",
        variables: closingRequest.toGraphqlVariables(),
        fields: ["id", 'status', "createdTime", "transactionValue", "note"]
      }]
    })
  closingRequest.load(response.assignedCustomer.submitClosingRequest)
}
</script>

<style lang="scss" scoped></style>