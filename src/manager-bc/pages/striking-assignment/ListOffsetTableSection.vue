<template>
  <OffsetPaginationComponent :pagination="customerAssignmentPagination">
    <v-table height="402px" density="compact" style="width: 100%;" class="datatable">
      <thead>
        <tr>
          <th>sales</th>
          <th colspan="2">customer</th>
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="customerAssignmentPagination.resultList.length < 1">
          <td class="no-data" colspan="12">
            <div class="justify-center text-center pa-5">
              <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
              <span class="text-disabled text-body-1">Data Customer Assignment kosong</span>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(customerAssignment, index) in customerAssignmentPagination.resultList"
          :key="customerAssignment.id ?? index" @dblclick="toDetail(customerAssignment.id!)">
          <td>{{ customerAssignment.sales?.name }}</td>
          <td>{{ customerAssignment.customer?.name }}</td>
          <td><v-rating disabled :length="3" :size="16" :model-value="customerAssignment.customer?.rating"
              active-color="primary" /></td>
          <td>{{ customerAssignment.status }}</td>
        </tr>
      </tbody>
    </v-table>
  </OffsetPaginationComponent>
</template>

<script setup lang="ts">
import { StrikingAssignmentType } from '@/company-bc/domain/model/manager/sales/striking-assignment';
import OffsetPaginationComponent from '@/resources/components/OffsetPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import OffsetPagination from '@/resources/components/offset-pagination';
import FilterType from '@/resources/components/pagination/filter';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{ hiddenFilters: FilterType[] }>()
const router = useRouter();

const { managerRepository } = useDependencyInjection();

const customerAssignmentPagination = reactive(new OffsetPagination<StrikingAssignmentType>(
  async (pagination) => {
    const response = await managerRepository.getUser()
      .executeManagerGraphqlQuery<{ strikingAssignmentList: PaginationResponseType<StrikingAssignmentType> }>({
        operation: "strikingAssignmentList",
        variables: pagination.toGraphqlVariables(),
        fields: OffsetPagination.wrapResultFields([
          "id", "status",
          { customer: ["name", "rating", { city: ["name"] }] },
          { sales: ["name"] },
        ])
      })
    return response.strikingAssignmentList;
  },
  [],
  new KeywordSearch(["Customer.name", "Sales.name"])
))

onMounted(async () => {
  props.hiddenFilters.forEach(filter => {
    customerAssignmentPagination.addHiddenFilter(filter);
  });
  await customerAssignmentPagination.loadPage();
})

const toDetail = (strikingAssignmnetId: string) => router.push(`/manager-striking-assignment/${strikingAssignmnetId}`)

</script>

<style scoped></style>