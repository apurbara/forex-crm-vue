<template>
  <section class="page-section calendar-container is-light-mode">
    <Qalendar :events="calendarSchedules" :config="config">
      <template #eventDialog="props">
        <div class="pa-6">
          <div>
            <IconAndInfoComponent :info="{ value: props.eventDialogData?.title, icon: 'mdi-calendar-check-outline' }" />
          </div>
          <div>
            <IconAndInfoComponent :info="{ value: props.eventDialogData?.with, icon: 'mdi-account-tie-outline' }" />
          </div>
          <div>
            <IconAndInfoComponent
              :info="{ value: renderStartEndTime(props.eventDialogData?.time), icon: 'mdi-clock-time-four-outline' }" />
          </div>
          <div class="d-flex justify-end">
            <v-btn color="primary" @click="toCustomerAssignmentDetail(props.eventDialogData.id)">manage</v-btn>
          </div>
        </div>
      </template>
    </Qalendar>
  </section>
</template>

<script setup lang="ts">
import { SalesActivityScheduleType } from "@/company-bc/domain/model/sales/customer-assignment/sales-activity-schedule";
import { useIsoToLocalTimeFormat } from "@/resources/composables/typography";
import IconAndInfoComponent from "@/shared/components/IconAndInfoComponent.vue";
import { useDependencyInjection } from "@/shared/composables/dependency-injection";
import { Qalendar } from "qalendar";
import { start } from "repl";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const { salesRepository } = useDependencyInjection()
const salesActivitySchedules = ref<SalesActivityScheduleType[]>([])
const router = useRouter();

const config = ref({ defaultMode: 'month', locale: 'id-ID', eventDialog: { isCustom: true } });
const calendarSchedules = computed(() => {
  return salesActivitySchedules.value.map((salesActivitySchedule: SalesActivityScheduleType) => {
    return {
      id: salesActivitySchedule.customerAssignment?.id,
      title: salesActivitySchedule.salesActivity?.name,
      with: salesActivitySchedule.customerAssignment?.customer?.name,
      time: { start: useIsoToLocalTimeFormat(salesActivitySchedule.startTime!), end: useIsoToLocalTimeFormat(salesActivitySchedule.endTime!) },
    }
  })
  // return salesActivityScheduleSummaryList.value.map((list) => {
  //   const { diffStatus } = useTimeIntervalDifferenceCounter(list.startTime!, list.endTime!)
  //   return {
  //     id: list.startTime! + list.status!,
  //     title: `${list.total} ` + (diffStatus === 'UPCOMING' ? ' upcoming' : diffStatus === 'ONGOING' ? " ongoing" : list.status === "COMPLETED" ? ' completed' : ' need report'),
  //     time: { start: useIsoToLocalTimeFormat(list.startTime!), end: useIsoToLocalTimeFormat(list.endTime!) },
  //     color: diffStatus === 'UPCOMING' ? 'blue' : diffStatus === 'ONGOING' ? "yellow" : list.status === "COMPLETED" ? 'green' : 'red'
  //   }
  // })
})

const renderStartEndTime = ((time: { start: string, end: string }): string => {
  return `${new Date(time?.start).toLocaleDateString('id-ID')} : ${new Date(time?.start).toLocaleTimeString('id-id')} - ${new Date(time?.end).toLocaleTimeString('id-ID')}`
})

onMounted(async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<{ viewAllNonInitialSchedules: SalesActivityScheduleType[] }>({
      operation: "viewAllNonInitialSchedules",
      variables: {},
      fields: [
        "id", "startTime", "endTime", "status",
        { customerAssignment: ["id", "status", { customer: ["name"] }] },
        { salesActivity: ["id", "name", "duration"] },
      ]
    })
  salesActivitySchedules.value = response.viewAllNonInitialSchedules
})

const toCustomerAssignmentDetail = (customerAssignmentId: string) => router.push(`/sales-customer-assignment/${customerAssignmentId}`)

</script>

<style scoped></style>