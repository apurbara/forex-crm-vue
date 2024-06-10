
import RecycleRequestComponent from '@/domain/model/personnel/manager/sales/customer-assignment/RecycleRequestComponent.vue';
<template>
  <RecycleRequestComponent :recycle-request="recycleRequest" />
  <div class="d-flex justify-center">
    <v-btn @click="submit">submit</v-btn>
  </div>
</template>

<script lang="ts" setup>
import CustomerAssignment from '@/sales-bc/domain-old/model/sales/customer-assignment';
import RecycleRequestComponent from '@/sales-bc/domain-old/model/sales/customer-assignment/RecycleRequestComponent.vue';
import RecycleRequest, { RecycleRequestType } from '@/sales-bc/domain-old/model/sales/customer-assignment/recycle-request';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { reactive } from 'vue';

const { httpRequest, salesRepository } = useDependencyInjection()
const props = defineProps<{ customerAssignment: CustomerAssignment }>()
const recycleRequest = reactive<RecycleRequest>(new RecycleRequest(props.customerAssignment))
const emit = defineEmits(['recycleRequestSubmitted'])

const submit = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ submitRecycleRequest: RecycleRequestType }>(httpRequest, {
      operation: "submitRecycleRequest",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...recycleRequest.toGraphqlVariables(),
      },
      fields: ["id", 'status', "createdTime", "note"]
    })
  recycleRequest.load(response.submitRecycleRequest)
  props.customerAssignment.addRecycleRequest(recycleRequest)
  emit('recycleRequestSubmitted')
}
</script>

<style lang="scss" scoped></style>