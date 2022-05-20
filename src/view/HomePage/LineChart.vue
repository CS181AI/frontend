<template>
  <div
    id="chart"
    style="width:100%;height:300px"
  />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import {
  GridComponent, GridComponentOption, LegendComponent, TooltipComponent,
} from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, defineProps } from 'vue';

interface Props {
  totalStep:number
  whiteNumList:number[]
  blackNumList:number[]
}

const props = defineProps<Props>();

echarts.use([GridComponent, LineChart, CanvasRenderer,
  UniversalTransition, LegendComponent, TooltipComponent]);

type EChartsOption = echarts.ComposeOption<
    GridComponentOption | LineSeriesOption
    >;

onMounted(() => {
  const chartDom = document.getElementById('chart')!;
  const myChart = echarts.init(chartDom);
  const list:number[] = [];
  for (let i = 0; i < props.totalStep; i++) {
    list.push(i + 1);
  }
  const option: EChartsOption = {
    animationDuration: 3000,
    legend: {
      data: ['white', 'black'],
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      name: 'step',
      type: 'category',
      data: list,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'white',
        data: props.whiteNumList,
        type: 'line',
      },
      {
        name: 'black',
        data: props.blackNumList,
        type: 'line',
      },
    ],
  };

  myChart.setOption(option);
});
</script>

<style scoped>

</style>
