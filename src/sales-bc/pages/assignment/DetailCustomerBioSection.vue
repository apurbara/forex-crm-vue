<template>
  <section class="page-section ma-2">
    <div class="d-flex justify-end mb-2">
      <v-btn v-if="!editingCustomerBio" variant="tonal" @click="editCustomerBio()">edit customer</v-btn>
      <v-btn v-else variant="tonal" @click="cancelEdit()">cancel</v-btn>
    </div>
    <div v-if="!editingCustomerBio" class="d-flex align-center justify-start flex-wrap">
      <InfoComponentIcon style="min-width: 40%;"
        :info="{ value: customerAssignment.customer.phone, icon: `mdi-phone-classic` }" />
      <InfoComponentIcon style="min-width: 40%;"
        :info="{ value: customerAssignment.customerJourney?.name, icon: `mdi-progress-star` }" />
      <InfoComponentIcon v-if="!editingCustomerBio" style="min-width: 40%;"
        :info="{ value: customerAssignment.customer.email, icon: `mdi-email-outline` }" />
      <InfoComponentIcon v-if="!editingCustomerBio" style="min-width: 40%;"
        :info="{ value: customerAssignment.customer.area?.name, icon: `mdi-map-marker-outline` }" />
    </div>
    <div v-else>
      <v-text-field label="name" v-model="customerAssignment.customer.name"
        :rules="[customerAssignment.customer.isValidName()]" density="compact" />
      <v-text-field label="email" v-model="customerAssignment.customer.email" density="compact"
        :rules="[customerAssignment.customer.isValidEmail()]" />
      <v-autocomplete label="area" variant="outlined" :items="areaList" density="compact" item-title="name"
        return-object v-model="customerAssignment.customer.area" />
    </div>
    <div v-if="editingCustomerBio" class="d-flex justify-end mb-4">
      <v-btn :disabled="!customerAssignment.customer?.isValidProperties()!" variant="tonal"
        @click="updateCustomerBio">update</v-btn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import InfoComponentIcon from '@/shared/components/info-componentIcon.vue';
import { AreaType } from '@/sales-bc/domain/dependency-model/area';
import CustomerAssignment, { CustomerAssignmentType } from '@/sales-bc/domain/model/sales/customer-assignment';

const props = defineProps<{ customerAssignment: CustomerAssignment }>();
const { httpRequest, companyUserRepository, salesRepository } = useDependencyInjection()

const editingCustomerBio = ref<boolean>(false);
const areaList = ref<AreaType[]>([]);
const customerSnapValue = ref<string>('');

const editCustomerBio = async () => {
  customerSnapValue.value = JSON.stringify(props.customerAssignment.customer)
  editingCustomerBio.value = true

  if (areaList.value.length < 1) {
    const response = await companyUserRepository.getUser()
      .executeGraphqlQueryInCompany<{ allAreaList: AreaType[] }>(httpRequest, {
        operation: "allAreaList",
        variables: { filters: { type: "[FilterInput]", value: [{ column: "Area.disabled", value: false }] } },
        fields: ["id", "name"]
      })
    areaList.value.push(...response.allAreaList)
  }
}
const cancelEdit = () => {
  props.customerAssignment.customer?.load(JSON.parse(customerSnapValue.value))
  editingCustomerBio.value = false
}
const updateCustomerBio = async () => {
  const response = await salesRepository.getUser()
    .executeSalesGraphqlMutation<{ updateCustomerBio: CustomerAssignmentType }>(httpRequest, {
      operation: "updateCustomerBio",
      variables: {
        id: { type: "ID", required: true, value: props.customerAssignment.id },
        customer: {
          type: "CustomerInput", value: props.customerAssignment.customer?.toGraphqlVariables()
        },
      },
      fields: [{ customer: ["name", "email", { area: ["id", "name"] }] }]
    })
  props.customerAssignment.customer?.load(response.updateCustomerBio.customer!)
  editingCustomerBio.value = false;
}

</script>

<style scoped></style>