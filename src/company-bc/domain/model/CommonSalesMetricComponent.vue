<template>
    <v-text-field label="name" v-model="commonSalesMetric.name" :rules="[commonSalesMetric.isValidName()]"
        :readonly="readonly" />
    <VCurrencyField v-model="commonSalesMetric.target" label="target" :readonly="readonly" />
    <v-row>
        <v-col cols="12" md="6">
            <v-select :items="metricTypeList" v-model="commonSalesMetric.metricType" label="metric type"
                :rules="[commonSalesMetric.isValidMetricType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="evaluationTypeList" v-model="commonSalesMetric.evaluationType" label="evaluation type"
                :rules="[commonSalesMetric.isValidEvaluationType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="recurrenceTypeList" v-model="commonSalesMetric.recurrenceType" label="recurrence type"
                :rules="[commonSalesMetric.isValidRecurrenceType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field type="number" label="recurrence count" v-model="commonSalesMetric.recurrenceCount"
                :rules="[commonSalesMetric.isValidRecurrenceCount()]" :readonly="readonly" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import CommonSalesMetric from './common-sales-metric';
import { MetricType } from '@/shared-bc/domain/enum/metric-type';
import { EvaluationType } from '@/shared-bc/domain/enum/evaluation-type';
import { RecurrenceType } from '@/shared-bc/domain/enum/recurrence-type';
import VCurrencyField from '@/shared/components/VCurrencyField.vue';
import { ref } from 'vue';

const props = defineProps<{ commonSalesMetric: CommonSalesMetric, readonly?: boolean }>()
const target = ref(1245)

const metricTypeList = Object.keys(MetricType)
const evaluationTypeList = Object.keys(EvaluationType)
const recurrenceTypeList = Object.keys(RecurrenceType)

</script>

<style scoped></style>