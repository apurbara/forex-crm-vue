<template>
    <v-text-field label="name" v-model="salesPerformanceMetric.name" :rules="[salesPerformanceMetric.isValidName()]"
        :readonly="readonly" />
    <v-row>
        <v-col cols="12" md="6">
            <v-select :items="salesPerformanceMetricTypeList" v-model="salesPerformanceMetric.salesPerformanceMetricType" label="sales performance metric type"
                :rules="[salesPerformanceMetric.isValidSalesPerformanceMetricType()]" :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-select :items="recurrenceTypeList" v-model="salesPerformanceMetric.recurrenceType"
                label="recurrence type" :rules="[salesPerformanceMetric.isValidRecurrenceType()]"
                :readonly="readonly" />
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field type="number" label="recurrence count" v-model="salesPerformanceMetric.recurrenceCount"
                :rules="[salesPerformanceMetric.isValidRecurrenceCount()]" :readonly="readonly" />
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" md="6" v-for="(evaluation, index) in salesPerformanceMetric.evaluations"
            :key="evaluation.id ?? index">
            <div>
                <div class="d-flex justify-end">
                    <v-btn color="success" icon="mdi-close-circle-outline"
                        @click="salesPerformanceMetric.removeEvaluation(evaluation)" />
                </div>
                <SalesPerformanceMetricEvaluationComponent :sales-performance-metric-evaluation="evaluation"
                    :readonly="readonly" />
            </div>
        </v-col>
        <v-col cols="12" md="6">
            <div class="d-flex justify-center">
                <v-btn :disabled="readonly" color="success" @click="salesPerformanceMetric.addEvaluation()">add
                    evaluation</v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SalesPerformanceMetric from './sales-performance-metric';
import { RecurrenceType } from '@/shared-bc/domain/enum/recurrence-type';
import SalesPerformanceMetricEvaluationComponent from './sales-performance-metric/SalesPerformanceMetricEvaluationComponent.vue';
import { SalesPerformanceMetricTypeEnum } from '@/shared-bc/domain/enum/sales-performance-metric-type-enum';


defineProps<{ salesPerformanceMetric: SalesPerformanceMetric, readonly?: boolean }>()

const salesPerformanceMetricTypeList = Object.keys(SalesPerformanceMetricTypeEnum)
const recurrenceTypeList = Object.keys(RecurrenceType)

</script>

<style scoped></style>