<template>
  <h1 class="page-title">Sales Activity List</h1>
  <OffsetPaginationComponent :pagination="pagination">
    <template v-slot:editSection>
      <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/sales-activity/set-initial">Set Initial
        Sales Activity</v-btn>
      <v-btn class="ml-2" prepend-icon="mdi-account-plus-outline" variant="tonal" to="/sales-activity/add">Add
        Sales Activity</v-btn>
    </template>
    <v-table height="400px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>name</th>
          <th>intial</th>
          <th>duration</th>
          <th>description</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Sales Activity kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(salesActivity, index) in pagination.resultList" :key="salesActivity.id ?? index"
          @dblclick="toDetail(salesActivity.id!)">
          <td>{{ salesActivity.name }}</td>
          <td><v-btn color="green" v-if="salesActivity.initial" variant="text" icon="mdi-check-circle-outline"
              size="small" /></td>
          <td>{{ salesActivity.duration }}</td>
          <td>{{ salesActivity.description }}</td>
          <td>
            <v-btn color="green" v-if="!salesActivity.disabled" variant="text" icon="mdi-toggle-switch-outline"
              @click="disableConfirmation($event, salesActivity.id!)"></v-btn>
            <v-btn color="red" v-else variant="text" icon="mdi-toggle-switch-off-outline"
              @click="enableConfirmation($event, salesActivity.id!)"></v-btn>
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
import { SalesActivityType } from '@/company-bc/domain/model/sales-activity';

const { companyUserRepository } = useDependencyInjection()
const router = useRouter();
const confirm = useConfirm();

const pagination = reactive(new OffsetPagination<SalesActivityType>(
  async (pagination) => {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ salesActivityList: PaginationResponseType<SalesActivityType> }>({
        operation: 'salesActivityList',
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          'id', 'disabled', 'name', 'initial', 'description', 'duration'
        ])
      })!
    return response.salesActivityList;
  },
  [
    new EnumFilter('status', 'SalesActivity.disabled', () => [{ label: 'active', value: false }, { label: 'disabled', value: true }], 'select status ...')
  ],
  new KeywordSearch(["SalesActivity.name", "SalesActivity.description"])
))

onMounted(async () => {
  await pagination.loadPage();
})

const toDetail = (salesactivityId: string) => router.push(`/sales-activity/${salesactivityId}`)

const disableConfirmation = (event: Event, salesActivityId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to disable this sales activity?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ disableSalesActivity: SalesActivityType }>({
          operation: "disableSalesActivity",
          variables: { id: { type: "ID", value: salesActivityId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (salesActivity: SalesActivityType) => salesActivity.id === salesActivityId
      )!.disabled = response.disableSalesActivity.disabled
    },
    reject: () => { }
  });
};
const enableConfirmation = (event: Event, salesActivityId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to enable this sales activity?',
    icon: 'mdi mdi-alert-outline',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const response = await companyUserRepository.getUser()!
        .executeGraphqlMutationInCompany<{ enableSalesActivity: SalesActivityType }>({
          operation: "enableSalesActivity",
          variables: { id: { type: "ID", value: salesActivityId } },
          fields: ['disabled']
        })
      pagination.resultList.find(
        (salesActivity: SalesActivityType) => salesActivity.id === salesActivityId
      )!.disabled = response.enableSalesActivity.disabled
    },
    reject: () => { }
  });
};

</script>

<style lang="scss" scoped></style>