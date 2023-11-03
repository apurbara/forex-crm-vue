
import RecycleRequestComponent from '@/domain/model/personnel/manager/sales/assigned-customer/RecycleRequestComponent.vue';
<template>
  <RecycleRequestComponent :recycle-request="recycleRequest" />
  <div class="d-flex justify-center">
    <v-btn @click="submit">submit</v-btn>
  </div>
</template>

<script lang="ts" setup>
import AssignedCustomer from '@/domain/model/personnel/manager/sales/assigned-customer';
import RecycleRequestComponent from '@/domain/model/personnel/manager/sales/assigned-customer/RecycleRequestComponent.vue';
import RecycleRequest, { RecycleRequestType } from '@/domain/model/personnel/manager/sales/assigned-customer/recycle-request';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';

const { httpRequest, userRepository } = useDependencyInjection()
const props = defineProps<{ assignedCustomer: AssignedCustomer }>()
const recycleRequest = reactive<RecycleRequest>(new RecycleRequest(props.assignedCustomer))

const submit = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlMutation<{ assignedCustomer: { submitRecycleRequest: RecycleRequestType } }>(httpRequest, {
      operation: "assignedCustomer",
      variables: { assignedCustomerId: { type: "ID", required: true, value: props.assignedCustomer.id } },
      fields: [{
        operation: "submitRecycleRequest",
        variables: recycleRequest.toGraphqlVariables(),
        fields: ["id", 'status', "createdTime", "note"]
      }]
    })
  recycleRequest.load(response.assignedCustomer.submitRecycleRequest)
}
</script>

<style lang="scss" scoped></style>