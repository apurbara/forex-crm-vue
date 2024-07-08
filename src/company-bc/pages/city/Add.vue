<template>
  <div>
    <h1 class="page-title">Add City</h1>
    <div class="form">
      <CityComponent :city="city" />
      <v-autocomplete label="province" variant="outlined" :items="provinceList" density="compact" item-title="name"
        return-object v-model="city.province" />
      <div class="d-flex justify-end">
        <v-btn :disabled="!city.isValidEntity()" @click="submit">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ProvinceType } from '@/company-bc/domain/model/province';
import City, { CityType } from '@/company-bc/domain/model/province/city';
import CityComponent from '@/company-bc/domain/model/province/CityComponent.vue';
import { useDependencyInjection } from '@/shared/composables/dependency-injection';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const provinceList = ref<ProvinceType[]>([]);
const city = reactive(new City());

const { companyUserRepository, cache } = useDependencyInjection()
const router = useRouter()

onMounted(async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlQueryInCompany<{ viewAllProvince: ProvinceType[] }>({
      operation: 'viewAllProvince',
      variables: { filters: { type: "[FilterInput]", value: [{ column: "Province.disabled", value: false }] } },
      fields: ['id', 'name']
    })
  provinceList.value = response.viewAllProvince
})

const submit = async () => {
  const response = await companyUserRepository.getUser()!
    .executeGraphqlMutationInCompany<{ addCity: CityType }>({
      operation: 'addCity',
      variables: city.toGraphqlVariables(),
      fields: [
        'id', 'disabled', 'createdTime', 'name', { province: ["id", "name"] }
      ]
    })
  cache?.set(`city-${response?.addCity.id}`, response?.addCity)
  router.push(`/city/${response?.addCity.id}`)
}

</script>

<style lang="scss" scoped></style>