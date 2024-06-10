<template>
  <div>
    <h1 class="page-title">Customer Assignment List</h1>
    <div class="d-flex justify-space-around mb-8">
      <v-card class="pa-4">
        <v-card-title>{{ totalCustomerAssignment }}</v-card-title>
        <v-card-subtitle>total assignment</v-card-subtitle>
      </v-card>
      <v-card class="pa-4">
        <v-card-title>{{ totalActiveAssignment }}</v-card-title>
        <v-card-subtitle>active assignment</v-card-subtitle>
      </v-card>
      <v-card class="pa-4">
        <v-card-title>{{ totalGoodfundAssignment }}</v-card-title>
        <v-card-subtitle>good fund</v-card-subtitle>
      </v-card>
      <v-card class="pa-4">
        <v-card-title>{{ totalRecycleAssignment }}</v-card-title>
        <v-card-subtitle>recycled</v-card-subtitle>
      </v-card>
    </div>
    <CursorPaginationComponent :pagination="customerAssignmentPagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/customer-assignment/register">Register
          Customer</v-btn>
        <v-btn @click="viewAsCard = !viewAsCard" class="ml-4">switch view</v-btn>
      </template>
      <div class="card-list" v-if="viewAsCard">
        <PersonCardComponent class="card-list__item" style="min-height: 150px; width: 300px;"
          v-for="(customerAssignment, key) in customerAssignmentPagination.resultList" :key="key"
          :person="{ name: customerAssignment.customer?.name!, bio: `${customerAssignment.customer?.email}` }"
          :to="`/customer-assignment/${customerAssignment.id}`">
          <v-chip color="success">{{ customerAssignment.customer?.area?.name }}</v-chip>
        </PersonCardComponent>
      </div>
      <v-table height="400px" density="compact" style="width: 100%;" class="datatable px-2" v-else>
        <thead>
          <tr>
            <th>name</th>
            <th>email</th>
            <th>phone</th>
            <th>status</th>
            <th>area</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="customerAssignmentPagination.resultList.length < 1">
            <td class="no-data" colspan="12">
              <div class="justify-center text-center pa-5">
                <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
                <span class="text-disabled text-body-1">Data AreaStructure kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(customerAssignment, index) in customerAssignmentPagination.resultList"
            :key="customerAssignment.id ?? index" @dblclick="toDetail(customerAssignment.id!)">
            <td>{{ customerAssignment.customer?.name }}</td>
            <td>{{ customerAssignment.customer?.email }}</td>
            <td>{{ customerAssignment.customer?.phone }}</td>
            <td>{{ customerAssignment.status }}</td>
            <td>{{ customerAssignment.customer?.area?.name }}</td>
          </tr>
        </tbody>
      </v-table>
    </CursorPaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import CursorPaginationComponent from '@/resources/components/CursorPaginationComponent.vue';
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import CursorPagination from '@/resources/components/cursor-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { CustomerAssignmentType } from '@/sales-bc/domain-old/model/sales/customer-assignment';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';


const { httpRequest, salesRepository } = useDependencyInjection();
const router = useRouter();
const viewAsCard = ref<boolean>(false)
const totalCustomerAssignment = ref<number>(0)
const totalActiveAssignment = ref<number>(0)
const totalRecycleAssignment = ref<number>(0)
const totalGoodfundAssignment = ref<number>(0)

const customerAssignmentPagination = reactive(new CursorPagination<CustomerAssignmentType>(
  async (pagination) => {
    const response = await salesRepository.getUser()
      .executeSalesGraphqlQuery<{ customerAssignmentList: PaginationResponseType<CustomerAssignmentType> }>(httpRequest, {
        operation: "customerAssignmentList",
        variables: pagination.toGraphqlVariables(),
        fields: CursorPagination.wrapResultFields(["id", "status", { customer: ["id", "name", "email", "phone", { area: ["name"] }] }])
      })
    return response.customerAssignmentList;
  },
  [
    new EnumFilter('disabled', 'CustomerAssignment.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"])
))

onMounted(async () => {
  await customerAssignmentPagination.loadPage()
  await viewSummary()
})

const viewSummary = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlQuery<{ totalCustomerAssignment: number, totalActiveAssignment: number, totalGoodFundAssignment: number, totalRecycleAssignment: number }>(httpRequest, [
      {
        operation: "totalCustomerAssignment",
        variables: {},
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalActiveAssignment" },
        variables: { activeFilters: { type: "[FilterInput]", value: [{ column: "CustomerAssignment.status", value: 'ACTIVE' }], name: "filters" } },
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalGoodFundAssignment" },
        variables: { goodFundFilters: { type: "[FilterInput]", value: [{ column: "CustomerAssignment.status", value: 'GOOD_FUND' }], name: "filters" } },
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalRecycleAssignment" },
        variables: { recycledFilters: { type: "[FilterInput]", value: [{ column: "CustomerAssignment.status", value: 'RECYCLED' }], name: "filters" } },
        fields: []
      }
    ])
  totalCustomerAssignment.value = response.totalCustomerAssignment
  totalActiveAssignment.value = response.totalActiveAssignment
  totalGoodfundAssignment.value = response.totalGoodFundAssignment
  totalRecycleAssignment.value = response.totalRecycleAssignment
}

const toDetail = (customerAssignmentId: string) => router.push(`/sales-customer-assignment/${customerAssignmentId}`)

</script>

<style lang="scss" scoped></style>