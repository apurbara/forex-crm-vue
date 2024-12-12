<template>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/sales-metric/create-striker-metric">Create
        Striker Metric</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>sales metric type</th>
          <th>evaluation type</th>
          <th>recurrence type</th>
          <th>recurrence count</th>
          <th>target</th>
          <th>daily reminder</th>
          <th>created time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Striker Metric kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(strikerMetric, index) in pagination.resultList" :key="strikerMetric.id ?? index"
          @dblclick="toDetail(strikerMetric.id!)">
          <td>{{ strikerMetric.name }}</td>
          <td>{{ strikerMetric.salesMetricType }}</td>
          <td>{{ strikerMetric.evaluationType }}</td>
          <td>{{ strikerMetric.recurrenceType }}</td>
          <td>{{ strikerMetric.recurrenceCount }}</td>
          <td>{{ thousandSeparator(strikerMetric.target ?? 0) }}</td>
          <td>{{ thousandSeparator(strikerMetric.dailyReminderTarget ?? 0) }}</td>
          <td>{{ new Date(strikerMetric.createdTime!).toLocaleDateString() }}</td>
          <td>
            <v-btn color="green" v-if="!strikerMetric.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, strikerMetric.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, strikerMetric.id!)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script lang="ts" setup>
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { StrikerMetricType } from '@/company-bc/domain/model/striker-metric';
import { useThousandSeparator } from '@/resources/composables/typography';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const thousandSeparator = (value: number) => useThousandSeparator(value);

const pagination = reactive(new OffsetPagination<StrikerMetricType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewStrikerMetricList: PaginationResponseType<StrikerMetricType> }>({
        operation: 'viewStrikerMetricList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'disabled', 'createdTime', 'name', 'target', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount'
        ])
      })!
    return response.viewStrikerMetricList;
  },
  [
    new EnumFilter('status', 'StrikerMetric.disabled', () => [{ label: 'active', value: false }, { label: 'disabled', value: true }], 'select status ...')
  ],
  new KeywordSearch(["StrikerMetric.name", "StrikerMetric.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (strikermetricId: string) => router.push(`/sales-metric/striker/${strikermetricId}`)

const disableConfirmation = (event: Event, strikerMetricId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableStrikerMetric: StrikerMetricType }>({
          operation: "disableStrikerMetric",
          variables: { id: { type: "ID", value: strikerMetricId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (strikerMetric: StrikerMetricType) => strikerMetric.id === strikerMetricId
      )!.disabled = response.disableStrikerMetric.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, strikerMetricId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableStrikerMetric: StrikerMetricType }>({
          operation: "enableStrikerMetric",
          variables: { id: { type: "ID", value: strikerMetricId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (strikerMetric: StrikerMetricType) => strikerMetric.id === strikerMetricId
      )!.disabled = response.enableStrikerMetric.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>