<template>
  <div>
    <h1 class="page-title">Personnel Detail</h1>
    <div class="form">
      <v-row>
        <v-col cols="12" md="6"><v-text-field label="Name" v-model="personnel.accountInfo.name" /></v-col>
        <v-col cols="12" md="6"><v-text-field label="Email" v-model="personnel.accountInfo.email" /></v-col>
      </v-row>
      <v-switch color="success" label="Active" v-model="personnel.disabled" :true-value="false" :false-value="true" />
    </div>
    <section class="page-section">
      <div class="d-flex justify-space-between align-center">
        <h2 class="section-title">Manager Assignments</h2>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal" @click="assignAsManager">Assign as Manager</v-btn>
      </div>
      <div v-for="(manager, key) in personnel.managerAssignments" :key="key" class="my-2">
        <v-card>
          <v-card-text class="d-flex justify-start align-center">
            <v-chip v-if="manager.disabled" color="danger">disabled</v-chip>
            <v-chip v-else="manager.disabled" color="success">active</v-chip>
            <p class="ml-4">created time: {{ manager.createdTime }}</p>
          </v-card-text>
        </v-card>
      </div>
    </section>
    <section class="page-section">
      <div class="d-flex justify-space-between align-center">
        <h2 class="section-title">Sales Assignments</h2>
        <v-btn prepend-icon="mdi-account-plus-outline" variant="tonal"
          :to="`/personnel/${personnelId}/assign-as-sales`">Assign as Sales</v-btn>
      </div>
      <div v-for="(sales, key) in personnel.salesAssignments" :key="key" class="my-2">
        <v-card>
          <v-card-text class="d-flex justify-start align-center">
            <v-chip v-if="sales.disabled" color="danger">disabled</v-chip>
            <v-chip v-else="manager.disabled" color="success">active</v-chip>
            <p class="ml-4">created time: {{ sales.createdTime }}</p>
            <p class="ml-4">area: {{ sales.area?.label.name }}</p>
          </v-card-text>
        </v-card>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import Personnel, { PersonnelType } from '@/domain/model/personnel';
import Manager, { ManagerType } from '@/domain/model/personnel/manager';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const personnel = reactive(new Personnel())
const props = defineProps<{ personnelId: string }>()

onMounted(async () => {
  const cacheData = cache?.pull<PersonnelType>(`personnel-${props.personnelId}`);
  if (cacheData) {
    personnel.load(cacheData);
  } else {
    const response = await userRepository?.getUser<CompanyUserRoleInterface>()
      .executeGraphqlQueryInCompany<{ personnelDetail: PersonnelType }>(httpRequest, {
        operation: 'personnelDetail',
        variables: { personnelId: { type: 'ID!', value: props.personnelId } },
        fields: [
          'id', 'name', 'email', 'disabled',
          { managerAssignments: [{ list: ["id", "disabled", "createdTime"] }] },
          { salesAssignments: [{ list: ["id", "disabled", "createdTime", { area: ["id", "name"] }] }] }
        ],
      })
    personnel.load(response.personnelDetail)
  }
})

const assignAsManager = async () => {
  const response = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlMutationInCompany<{ personnel: { assignManager: ManagerType } }>(httpRequest, {
      operation: 'personnel',
      variables: { personnelId: { type: "ID", required: true, value: personnel.id } },
      fields: [{
        operation: 'assignManager',
        variables: {},
        fields: ['id', 'disabled', 'createdTime'],
      }]
    })
  const manager = new Manager();
  manager.load(response.personnel.assignManager)
  personnel.managerAssignments.unshift(manager);
}
</script>

<style lang="scss" scoped></style>