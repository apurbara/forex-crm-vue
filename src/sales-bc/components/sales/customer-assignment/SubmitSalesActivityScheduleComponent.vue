<template>
  <div class="d-flex justify-space-between">
    <v-select
      label="select activity"
      :items="salesActivityList"
      item-title="name"
      return-object
      v-model="salesActivitySchedule.salesActivity"
      hide-details
    />
    <DatePicker
      id="calendar-24h"
      v-model="salesActivitySchedule.startTime"
      showTime
      hourFormat="24"
      :stepMinute="60"
      class="ml-4"
      fluid
    />
    <div class="flex justify-end">
      <div class="d-flex justify-end mt-4">
        <v-btn
          block
          @click="submitNewSchedule"
          variant="tonal"
          :disabled="submittingNewSchedule || !salesActivitySchedule.isValidToSubmit()"
          >Submit</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import SalesActivitySchedule, {
  SalesActivityScheduleType,
} from "@/sales-bc/domain/model/sales/customer-assignment/salesActivitySchedule";
import { useSalesActivityStore } from "@/company-bc/stores/sales-activity-store";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import CustomerAssignment from "@/sales-bc/domain/model/sales/customer-assignment";

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const { salesRepository } = useDependencyInjection();
const salesActivityStore = useSalesActivityStore();
const salesActivitySchedule = reactive(new SalesActivitySchedule());

const salesActivityList = ref<SalesActivityType[]>([]);
onMounted(async () => {
  salesActivityList.value = await salesActivityStore.fecthAllActiveSalesActivityList();
});

const submittingNewSchedule = ref(false);
const submitNewSchedule = async () => {
  submittingNewSchedule.value = true;
  const response = await salesRepository
    .getUser()
    .executeSalesGraphqlMutation<{ submitSalesActivitySchedule: SalesActivityScheduleType }>({
      operation: "submitSalesActivitySchedule",
      variables: {
        CustomerAssignment_id: { type: "ID", required: true, value: props.customerAssignment.id },
        ...salesActivitySchedule.toGraphqlVariables(),
      },
      fields: ["id", "status", "startTime", "endTime", { salesActivity: ["name", "duration"] }],
    });
  const submittedActivitySchedule = new SalesActivitySchedule();
  submittedActivitySchedule.load(response.submitSalesActivitySchedule);
  props.customerAssignment.salesActivitySchedules.unshift(submittedActivitySchedule);
  submittingNewSchedule.value = false;
};
</script>

<style lang="scss" scoped></style>
