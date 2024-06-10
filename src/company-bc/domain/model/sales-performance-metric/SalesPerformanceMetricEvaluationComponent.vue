<template>
    <v-text-field label="alias" v-model="salesPerformanceMetricEvaluation.alias"
        :rules="[salesPerformanceMetricEvaluation.isValidAlias()]" :readonly="readonly" />
    <v-row>
        <v-col cols="12" md="6">
            <v-select :items="evaluationTypeList" v-model="salesPerformanceMetricEvaluation.evaluationType"
                label="evaluation type" :rules="[salesPerformanceMetricEvaluation.isValidEvaluationType()]"
                :readonly="readonly" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SalesPerformanceMetricEvaluation from './sales-performance-metric-evaluation';
import { EvaluationType } from '@/shared-bc/domain/enum/evaluation-type';


defineProps<{ salesPerformanceMetricEvaluation: SalesPerformanceMetricEvaluation, readonly?: boolean }>()
const evaluationTypeList = Object.keys(EvaluationType)

</script>

<style scoped></style>