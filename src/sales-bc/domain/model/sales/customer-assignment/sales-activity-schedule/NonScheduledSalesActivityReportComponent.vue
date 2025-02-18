<template>
  <div>
    <ProgressSpinner v-if="fetchingSalesActivityListData" />
    <Fluid v-else fluid class="flex flex-col gap-4">
      <FloatLabel variant="on">
        <Select
          v-if="salesActivityReport.salesActivitySchedule"
          v-model="salesActivityReport.salesActivitySchedule.salesActivity"
          inputId="sales_activity"
          :options="salesActivityList"
          optionLabel="name"
        />
        <label for="sales_activity">Select Activity</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <label for="content">Report Content</label>
        <Textarea
          ref="focus"
          id="content"
          v-model="salesActivityReport.content"
          rows="5"
          :invalid="salesActivityReport.isValidContent() !== true"
        />
        <Message
          severity="error"
          size="small"
          v-if="
            salesActivityReport.content !== undefined &&
            salesActivityReport.isValidContent() !== true
          "
          >{{ salesActivityReport.isValidContent() }}</Message
        >
      </FloatLabel>
    </Fluid>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { SalesActivityType } from "@/company-bc/domain/model/sales-activity";
import { useSalesActivityStore } from "@/company-bc/stores/sales-activity-store";
import { ProgressSpinner } from "primevue";
import SalesActivityReport from "./sales-activity-report";
import useFocus from "@/resources/composables/focus";

const props = defineProps<{ salesActivityReport: SalesActivityReport }>();
const { focus } = useFocus();

const salesActivityStore = useSalesActivityStore();
const salesActivityList = ref<SalesActivityType[]>();
const fetchingSalesActivityListData = ref(true);
onMounted(async () => {
  salesActivityList.value = await salesActivityStore.fecthAllActiveSalesActivityList();
  props.salesActivityReport.salesActivitySchedule!.salesActivity = salesActivityList.value.find(
    (el) => el.initial
  );
  //
  fetchingSalesActivityListData.value = false;
});
</script>

<style lang="scss" scoped></style>
