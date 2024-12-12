<template>
  <div>
    <v-text-field label="name" v-model="customer.name" :rules="[customer.isValidName()]" density="compact" />
    <v-text-field label="email" v-model="customer.email" density="compact" :rules="[customer.isValidEmail()]" />
    <v-autocomplete label="city" variant="outlined" :items="cityList" density="compact" item-title="name" return-object
      v-model="customer.city" />
    <v-textarea v-model="customer.bio" label="bio" auto-grow></v-textarea>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { CityType } from '@/company-bc/domain/model/province/city';
import Customer from './customer';

defineProps<{ customer: Customer }>();
const { companyUserRepository } = useDependencyInjection()

const cityList = ref<CityType[]>([]);

onMounted(async () => {
  if (cityList.value.length < 1) {
    const response = await companyUserRepository.getUser()!
      .executeGraphqlQueryInCompany<{ viewAllCity: CityType[] }>({
        operation: "viewAllCity",
        variables: { filters: { type: "[FilterInput]", value: [{ column: "City.disabled", value: false }] } },
        fields: ["id", "name"]
      })
    cityList.value.push(...response.viewAllCity)
  }
})

</script>

<style scoped></style>