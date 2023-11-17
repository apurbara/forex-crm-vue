<template>
  <div>
    <h1 class="page-title">Assigned Customer List</h1>
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
    <CursorPaginationComponent :pagination="assignedCustomerPagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/assigned-customer/register">Register
          Customer</v-btn>
        <v-btn @click="viewAsCard = !viewAsCard" class="ml-4">switch view</v-btn>
      </template>
      <div class="card-list" v-if="viewAsCard">
        <PersonCardComponent class="card-list__item" style="min-height: 150px; width: 300px;"
          v-for="(assignedCustomer, key) in assignedCustomerPagination.resultList" :key="key"
          :person="{ name: assignedCustomer.customer?.name!, bio: `${assignedCustomer.customer?.email}` }"
          :to="`/assigned-customer/${assignedCustomer.id}`">
          <v-chip color="success">{{ assignedCustomer.customer?.area?.name }}</v-chip>
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
          <tr v-if="assignedCustomerPagination.resultList.length < 1">
            <td class="no-data" colspan="12">
              <div class="justify-center text-center pa-5">
                <img src="@/assets/images/image-no-data.svg" alt="No Data" /><br /><br />
                <span class="text-disabled text-body-1">Data AreaStructure kosong</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(assignedCustomer, index) in assignedCustomerPagination.resultList"
            :key="assignedCustomer.id ?? index" @dblclick="toDetail(assignedCustomer.id!)">
            <td>{{ assignedCustomer.customer?.name }}</td>
            <td>{{ assignedCustomer.customer?.email }}</td>
            <td>{{ assignedCustomer.customer?.phone }}</td>
            <td>{{ assignedCustomer.status }}</td>
            <td>{{ assignedCustomer.customer?.area?.name }}</td>
          </tr>
        </tbody>
      </v-table>
    </CursorPaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import { KeywordSearch, PaginationResponseType } from '@/resources/components/abstract-pagination';
import EnumFilter from '@/resources/components/pagination/enum-filter';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { AssignedCustomerType } from '@/domain/model/personnel/manager/sales/assigned-customer';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import SalesRole from '@/domain/user-role/personnel/sales-role';
import CursorPagination from '@/resources/components/cursor-pagination';
import CursorPaginationComponent from '@/resources/components/CursorPaginationComponent.vue';
import { ref } from 'vue';

const { httpRequest, userRepository } = useDependencyInjection();
const router = useRouter();
const viewAsCard = ref<boolean>(false)
const totalCustomerAssignment = ref<number>(0)
const totalActiveAssignment = ref<number>(0)
const totalRecycleAssignment = ref<number>(0)
const totalGoodfundAssignment = ref<number>(0)

const assignedCustomerPagination = reactive(new CursorPagination<AssignedCustomerType>(
  async (pagination) => {
    const response = await userRepository.getUser<SalesRole>()
      .executeSalesGraphqlQuery<{ assignedCustomerList: PaginationResponseType<AssignedCustomerType> }>(httpRequest, {
        operation: "assignedCustomerList",
        variables: pagination.toGraphqlVariables(),
        fields: CursorPagination.wrapResultFields(["id", "status", { customer: ["id", "name", "email", "phone", { area: ["name"] }] }])
      })
    return response.assignedCustomerList;
  },
  [
    new EnumFilter('disabled', 'AssignedCustomer.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["Customer.name", "Customer.email", "Customer.phone"])
))

onMounted(async () => {
  await assignedCustomerPagination.loadPage()
  await viewSummary()
})

const viewSummary = async () => {
  const response = await userRepository.getUser<SalesRole>()
    .executeSalesGraphqlQuery<{ totalCustomerAssignment: number, totalActiveAssignment: number, totalGoodFundAssignment: number, totalRecycleAssignment: number }>(httpRequest, [
      {
        operation: "totalCustomerAssignment",
        variables: {},
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalActiveAssignment" },
        variables: { activeFilters: { type: "[FilterInput]", value: [{ column: "AssignedCustomer.status", value: 'ACTIVE' }], name: "filters" } },
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalGoodFundAssignment" },
        variables: { goodFundFilters: { type: "[FilterInput]", value: [{ column: "AssignedCustomer.status", value: 'GOOD_FUND' }], name: "filters" } },
        fields: []
      },
      {
        operation: { name: "totalCustomerAssignment", alias: "totalRecycleAssignment" },
        variables: { recycledFilters: { type: "[FilterInput]", value: [{ column: "AssignedCustomer.status", value: 'RECYCLED' }], name: "filters" } },
        fields: []
      }
    ])
  totalCustomerAssignment.value = response.totalCustomerAssignment
  totalActiveAssignment.value = response.totalActiveAssignment
  totalGoodfundAssignment.value = response.totalGoodFundAssignment
  totalRecycleAssignment.value = response.totalRecycleAssignment
}

const toDetail = (assignedCustomerId: string) => router.push(`/assigned-customer/${assignedCustomerId}`)

</script>

<style lang="scss" scoped></style>