<template>
    <v-text-field label="name" v-model="factFinderMetric.name" :rules="[factFinderMetric.validateName()]"
        :readonly="readonly" />
    <VCurrencyField v-model="factFinderMetric.target" label="target" :readonly="readonly" />
    <VCurrencyField v-model="factFinderMetric.dailyReminderTarget" label="daily reminder target" :readonly="readonly" />
    <v-row>
        <v-col cols="12" md="6">
            <v-select :items="salesMetricTypeList" v-model="factFinderMetric.salesMetricType" label="sales metric type"
                :rules="[factFinderMetric.validateSalesMetricType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="evaluationTypeList" v-model="factFinderMetric.evaluationType" label="evaluation type"
                :rules="[factFinderMetric.validateEvaluationType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="recurrenceTypeList" v-model="factFinderMetric.recurrenceType" label="recurrence type"
                :rules="[factFinderMetric.validateRecurrenceType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field type="number" label="recurrence count" v-model="factFinderMetric.recurrenceCount"
                :rules="[factFinderMetric.validateRecurrenceCount()]" :readonly="readonly" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { EvaluationType } from '@/shared-bc/domain/enum/evaluation-type';
import { RecurrenceType } from '@/shared-bc/domain/enum/recurrence-type';
import VCurrencyField from '@/shared/components/VCurrencyField.vue';
import { SalesMetricTypeEnum } from '@/shared-bc/domain/enum/sales-metric-type-enum';
import FactFinderMetric from './fact-finder-metric';

defineProps<{ factFinderMetric: FactFinderMetric, readonly?: boolean }>()

const salesMetricTypeList = Object.keys(SalesMetricTypeEnum)
const evaluationTypeList = Object.keys(EvaluationType)
const recurrenceTypeList = Object.keys(RecurrenceType)

</script>

<style scoped></style>