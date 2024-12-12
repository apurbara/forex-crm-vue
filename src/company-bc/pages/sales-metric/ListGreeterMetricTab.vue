<template>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/sales-metric/create-greeter-metric">Create
        Greeter Metric</v-btn>
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
              <span class="text-disabled text-body-1">Data Greeter Metric kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(greeterMetric, index) in pagination.resultList" :key="greeterMetric.id ?? index"
          @dblclick="toDetail(greeterMetric.id!)">
          <td>{{ greeterMetric.name }}</td>
          <td>{{ greeterMetric.salesMetricType }}</td>
          <td>{{ greeterMetric.evaluationType }}</td>
          <td>{{ greeterMetric.recurrenceType }}</td>
          <td>{{ greeterMetric.recurrenceCount }}</td>
          <td>{{ thousandSeparator(greeterMetric.target ?? 0) }}</td>
          <td>{{ thousandSeparator(greeterMetric.dailyReminderTarget ?? 0) }}</td>
          <td>{{ new Date(greeterMetric.createdTime!).toLocaleDateString() }}</td>
          <td>
            <v-btn color="green" v-if="!greeterMetric.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, greeterMetric.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, greeterMetric.id!)"></v-btn>
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
import { GreeterMetricType } from '@/company-bc/domain/model/greeter-metric';
import { useThousandSeparator } from '@/resources/composables/typography';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const thousandSeparator = (value: number) => useThousandSeparator(value);

const pagination = reactive(new OffsetPagination<GreeterMetricType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewGreeterMetricList: PaginationResponseType<GreeterMetricType> }>({
        operation: 'viewGreeterMetricList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'disabled', 'createdTime', 'name', 'target', 'salesMetricType', 'dailyReminderTarget', 'evaluationType', 'recurrenceType', 'recurrenceCount'
        ])
      })!
    return response.viewGreeterMetricList;
  },
  [
    new EnumFilter('status', 'GreeterMetric.disabled', () => [{ label: 'active', value: false }, { label: 'disabled', value: true }], 'select status ...')
  ],
  new KeywordSearch(["GreeterMetric.name", "GreeterMetric.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (greetermetricId: string) => router.push(`/sales-metric/greeter/${greetermetricId}`)

const disableConfirmation = (event: Event, greeterMetricId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableGreeterMetric: GreeterMetricType }>({
          operation: "disableGreeterMetric",
          variables: { id: { type: "ID", value: greeterMetricId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (greeterMetric: GreeterMetricType) => greeterMetric.id === greeterMetricId
      )!.disabled = response.disableGreeterMetric.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, greeterMetricId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this metric?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableGreeterMetric: GreeterMetricType }>({
          operation: "enableGreeterMetric",
          variables: { id: { type: "ID", value: greeterMetricId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (greeterMetric: GreeterMetricType) => greeterMetric.id === greeterMetricId
      )!.disabled = response.enableGreeterMetric.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>