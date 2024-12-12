<template>
    <v-text-field label="name" v-model="greeterMetric.name" :rules="[greeterMetric.validateName()]"
        :readonly="readonly" />
    <VCurrencyField v-model="greeterMetric.target" label="target" :readonly="readonly" />
    <VCurrencyField v-model="greeterMetric.dailyReminderTarget" label="daily reminder target" :readonly="readonly" />
    <v-row>
        <v-col cols="12" md="6">
            <v-select :items="salesMetricTypeList" v-model="greeterMetric.salesMetricType" label="sales metric type"
                :rules="[greeterMetric.validateSalesMetricType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="evaluationTypeList" v-model="greeterMetric.evaluationType" label="evaluation type"
                :rules="[greeterMetric.validateEvaluationType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="recurrenceTypeList" v-model="greeterMetric.recurrenceType" label="recurrence type"
                :rules="[greeterMetric.validateRecurrenceType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field type="number" label="recurrence count" v-model="greeterMetric.recurrenceCount"
                :rules="[greeterMetric.validateRecurrenceCount()]" :readonly="readonly" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { EvaluationType } from '@/shared-bc/domain/enum/evaluation-type';
import { RecurrenceType } from '@/shared-bc/domain/enum/recurrence-type';
import VCurrencyField from '@/shared/components/VCurrencyField.vue';
import { ref } from 'vue';
import GreeterMetric from './greeter-metric';
import { SalesMetricTypeEnum } from '@/shared-bc/domain/enum/sales-metric-type-enum';

defineProps<{ greeterMetric: GreeterMetric, readonly?: boolean }>()

const salesMetricTypeList = Object.keys(SalesMetricTypeEnum)
const evaluationTypeList = Object.keys(EvaluationType)
const recurrenceTypeList = Object.keys(RecurrenceType)

</script>

<style scoped></style>