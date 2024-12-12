<template>
    <v-text-field label="name" v-model="salesRank.name" :rules="[salesRank.isValidName()]" :readonly="readonly" />
    <v-text-field type="number" label="display sales number" v-model="salesRank.displaySalesNumber"
        :rules="[salesRank.isValidDisplaySalesNumber()]" :readonly="readonly" />
    <v-row>
        <v-col cols="12" md="6">
            <v-select :items="salesMetricTypeList" v-model="salesRank.salesMetricType" label="sales metric type"
                :rules="[salesRank.isValidSalesMetricType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="salesRoleList" v-model="salesRank.salesRole" label="sales role"
                :rules="[salesRank.isValidSalesRole()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="evaluationTypeList" v-model="salesRank.evaluationType" label="evaluation type"
                :rules="[salesRank.isValidEvaluationType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="recurrenceTypeList" v-model="salesRank.recurrenceType" label="recurrence type"
                :rules="[salesRank.isValidRecurrenceType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="queryOrderList" v-model="salesRank.queryOrder" label="query order"
                :rules="[salesRank.isValidQueryOrder()]" :readonly="readonly" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SalesRank from './sales-rank';
import { EvaluationType } from '@/shared-bc/domain/enum/evaluation-type';
import { RecurrenceType } from '@/shared-bc/domain/enum/recurrence-type';
import { QueryOrderType } from '@/shared-bc/domain/enum/query-order';
import { SalesMetricTypeEnum } from '@/shared-bc/domain/enum/sales-metric-type-enum';
import { SalesRoleEnum } from '@/shared-bc/domain/enum/sales-role-enum';


defineProps<{ salesRank: SalesRank, readonly?: boolean }>()

const salesMetricTypeList = Object.keys(SalesMetricTypeEnum)
const salesRoleList = Object.keys(SalesRoleEnum)
const evaluationTypeList = Object.keys(EvaluationType)
const recurrenceTypeList = Object.keys(RecurrenceType)
const queryOrderList = Object.keys(QueryOrderType)

</script>

<style scoped></style>