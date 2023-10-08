<template>
  <div>
    <div class="d-flex justify-space-between ma-2 pa-0">
      <div>Manager List</div>
      <v-btn to="/manager/add">add manager</v-btn>
    </div>
    <PaginationComponent class="ma-2 pa-0" :pagination="managerList">
      <v-row class="py-4">
        <v-col v-for="(manager, index) in managerList.list" cols="12" sm="4" md="3" :key="manager.id ?? index">
          <PersonCardComponent :person="manager" :to="`/manager/${manager.id}`"></PersonCardComponent>
          <!-- <PersonCardComponent :person="manager" @click="$router.push(`/manager/${manager.id}`)" pointer-cursor></PersonCardComponent> -->
        </v-col>
      </v-row>
    </PaginationComponent>
  </div>
</template>

<script lang="ts" setup>
import HttpRequestInterface from '@/domain/http-request-interface';
import { ManagerListDataInterface } from '@/domain/model/manager';
import ManagerTask from '@/domain/task/corporate-bc/manager-task';
import UserRepository from '@/domain/user-repository';
import PaginationComponent from '@/resources/components/PaginationComponent.vue';
import Pagination from '@/resources/components/pagination';
import PersonCardComponent from '@/shared/components/person-card-component.vue';
import { inject, reactive } from 'vue';

const httpRequest = inject<HttpRequestInterface>('httpRequest')!;
const userRepository = inject<UserRepository>('userRepository');

const managerList = reactive(new Pagination<ManagerListDataInterface>(
  async (pagination: Pagination<ManagerListDataInterface>) => await new ManagerTask(httpRequest).viewList(pagination, userRepository?.getUserToken()!)
))
managerList.init();


</script>

<style lang="scss" scoped></style>