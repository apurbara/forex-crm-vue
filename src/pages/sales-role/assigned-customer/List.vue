<template>
  <div>
    <h1 class="page-title">Assigned Customer List</h1>
    <CursorPaginationComponent :pagination="assignedCustomerPagination">
      <template v-slot:editSection>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" to="/assigned-customer/register">Register
          Customer</v-btn>
      </template>
      <div height="400px" density="compact" class="card-list">
        <PersonCardComponent class="card-list__item" v-for="(assignedCustomer, key) in assignedCustomerPagination.resultList" :key="key"
          :person="{ name: assignedCustomer.customer?.name!, bio: `${assignedCustomer.customer?.email}` }"
          :to="`/assigned-customer/${assignedCustomer.id}`">
          <v-chip color="success">{{ assignedCustomer.customer?.area?.name }}</v-chip>
        </PersonCardComponent>
      </div>
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

const { httpRequest, userRepository } = useDependencyInjection();
const router = useRouter();

const assignedCustomerPagination = reactive(new CursorPagination<AssignedCustomerType>(
  async (pagination) => {
    const response = await userRepository.getUser<SalesRole>()
      .executeSalesGraphqlQuery<{ assignedCustomerList: PaginationResponseType<AssignedCustomerType> }>(httpRequest, {
        operation: "assignedCustomerList",
        variables: pagination.toGraphqlVariables(),
        fields: CursorPagination.wrapResultFields(["id", { customer: ["id", "name", "email", { area: ["name"] }] }])
      })
    return response.assignedCustomerList;
  },
  [
    new EnumFilter('disabled', 'AssignedCustomer.disabled', () => [{ status: true, name: 'disabled' }, { status: false, name: 'active' }], 'IN', undefined, 'name', 'status'),
  ],
  new KeywordSearch(["AssignedCustomer.name", "AssignedCustomer.email"])
))

onMounted(async () => {
  await assignedCustomerPagination.loadPage();
})

</script>

<style lang="scss" scoped></style>