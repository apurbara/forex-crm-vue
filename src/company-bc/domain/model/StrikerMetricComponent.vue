<template>
    <v-text-field label="name" v-model="strikerMetric.name" :rules="[strikerMetric.validateName()]"
        :readonly="readonly" />
    <VCurrencyField v-model="strikerMetric.target" label="target" :readonly="readonly" />
    <VCurrencyField v-model="strikerMetric.dailyReminderTarget" label="daily reminder target" :readonly="readonly" />
    <v-row>
        <v-col cols="12" md="6">
            <v-select :items="salesMetricTypeList" v-model="strikerMetric.salesMetricType" label="sales metric type"
                :rules="[strikerMetric.validateSalesMetricType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="evaluationTypeList" v-model="strikerMetric.evaluationType" label="evaluation type"
                :rules="[strikerMetric.validateEvaluationType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="recurrenceTypeList" v-model="strikerMetric.recurrenceType" label="recurrence type"
                :rules="[strikerMetric.validateRecurrenceType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field type="number" label="recurrence count" v-model="strikerMetric.recurrenceCount"
                :rules="[strikerMetric.validateRecurrenceCount()]" :readonly="readonly" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { EvaluationType } from '@/shared-bc/domain/enum/evaluation-type';
import { RecurrenceType } from '@/shared-bc/domain/enum/recurrence-type';
import VCurrencyField from '@/shared/components/VCurrencyField.vue';
import { ref } from 'vue';
import StrikerMetric from './striker-metric';
import { SalesMetricTypeEnum } from '@/shared-bc/domain/enum/sales-metric-type-enum';

defineProps<{ strikerMetric: StrikerMetric, readonly?: boolean }>()

const salesMetricTypeList = Object.keys(SalesMetricTypeEnum)
const evaluationTypeList = Object.keys(EvaluationType)
const recurrenceTypeList = Object.keys(RecurrenceType)

</script>

<style scoped></style>