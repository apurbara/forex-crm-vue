<template>
  <div>
    <h1 class="page-title">Assign Personnel As Sales</h1>
    <div class="form">
      <div>
        <p>Personnel Info</p>
        <p>name: {{ sales.personnel?.accountInfo.name }}</p>
      </div>
      <v-autocomplete variant="outlined" menu-icon="mdi-chevron-down" return-object :items="areaList" item-title="name"
        label="select area" @update:model-value="areaSelected" />
      <v-autocomplete variant="outlined" menu-icon="mdi-chevron-down" return-object :items="managerList"
        item-title="personnel.name" label="select manager" @update:model-value="managerSelected">
      </v-autocomplete>
      <v-select menu-icon="mdi-chevron-down" :items="['IN_HOUSE', 'FREELANCE']" label="select sales type"
        v-model="sales.type">
      </v-select>
      <div class="d-flex justify-end">
        <v-btn :disabled="!sales.isValidToSubmit()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Area, { AreaType } from '@/domain/model/area-structure/area';
import Personnel, { PersonnelType } from '@/domain/model/personnel';
import Manager, { ManagerType } from '@/domain/model/personnel/manager';
import Sales from '@/domain/model/personnel/manager/sales';
import { CompanyUserRoleInterface } from '@/domain/user-role/role-interfaces';
import router from '@/router';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { ref } from 'vue';
import { onMounted } from 'vue';

const { httpRequest, userRepository, cache } = useDependencyInjection();

const props = defineProps<{ personnelId: string }>()
const sales = ref<Sales>(new Sales());
const areaList = ref<AreaType[]>([])
const managerList = ref<ManagerType[]>([])

onMounted(async () => {
  const personnel = new Personnel()
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
          { managerAssignments: [{ list: ["id", "disabled", "createdTime"] }] }
        ],
      })
    personnel.load(response.personnelDetail)
  }
  sales.value = personnel.assignAsSales()
  sales.value.area = new Area()
  sales.value.manager = new Manager()
  //
  const areaResponseList = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlQueryInCompany<{ allAreaList: AreaType[] }>(httpRequest, {
      operation: "allAreaList",
      variables: {
        filters: {
          type: "[FilterInput]", value: [
            { column: "Area.disabled", value: false },
          ]
        }
      },
      fields: ['id', 'name', 'description']
    })
  areaList.value = areaResponseList.allAreaList
  //
  const managerResponseList = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlQueryInCompany<{ managerList: { list: ManagerType[] } }>(httpRequest, {
      operation: "managerList",
      variables: {
        filters: {
          type: "[FilterInput]", value: [
            { column: "Manager.disabled", value: false },
          ]
        }
      },
      fields: [{ list: ['id', { personnel: ['id', 'name'] }] }]
    })
  managerList.value.push(...managerResponseList.managerList.list)
})

const areaSelected = (areaData: any) => {
  sales.value.area?.load(areaData)
}

const managerSelected = (managerData: any) => {
  sales.value.manager?.load(managerData)
}

const submit = async () => {
  const response = await userRepository.getUser<CompanyUserRoleInterface>()
    .executeGraphqlMutationInCompany<{ personnel: { assignManager: ManagerType } }>(httpRequest, {
      operation: 'manager',
      variables: { managerId: { type: "ID", required: true, value: sales.value.manager?.id } },
      fields: [{
        operation: 'assignSales',
        variables: {
          personnelId: { type: "ID", required: true, value: sales.value.personnel?.id },
          areaId: { type: "ID", required: true, value: sales.value.area?.id },
          type: sales.value.type
        },
        fields: ['id', 'disabled', 'createdTime'],
      }]
    })
  router.push({ name: 'personnel-detail', params: { personnelId: props.personnelId } })
}
</script>

<style lang="scss" scoped></style>