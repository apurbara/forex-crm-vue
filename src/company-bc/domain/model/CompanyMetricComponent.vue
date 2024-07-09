<template>
    <v-text-field label="name" v-model="companyMetric.name" :rules="[companyMetric.isValidName()]"
        :readonly="readonly" />
    <VCurrencyField v-model="companyMetric.target!" label="target" :readonly="readonly" />
    <v-row>
        <v-col cols="12" md="6">
            <v-select :items="metricTypeList" v-model="companyMetric.metricType" label="metric type"
                :rules="[companyMetric.isValidMetricType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="evaluationTypeList" v-model="companyMetric.evaluationType" label="evaluation type"
                :rules="[companyMetric.isValidEvaluationType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="recurrenceTypeList" v-model="companyMetric.recurrenceType" label="recurrence type"
                :rules="[companyMetric.isValidRecurrenceType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field type="number" label="recurrence count" v-model="companyMetric.recurrenceCount"
                :rules="[companyMetric.isValidRecurrenceCount()]" :readonly="readonly" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import CompanyMetric from './company-metric';
import { MetricType } from '@/shared-bc/domain/enum/metric-type';
import { EvaluationType } from '@/shared-bc/domain/enum/evaluation-type';
import { RecurrenceType } from '@/shared-bc/domain/enum/recurrence-type';
import VCurrencyField from '@/shared/components/VCurrencyField.vue';

defineProps<{ companyMetric: CompanyMetric, readonly?: boolean }>()

const metricTypeList = Object.keys(MetricType)
const evaluationTypeList = Object.keys(EvaluationType)
const recurrenceTypeList = Object.keys(RecurrenceType)

</script>

<style scoped></style>