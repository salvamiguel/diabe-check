<template>
  <div class="h-64 w-full">
    <Line v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-ue-muted text-xs font-bold uppercase tracking-widest border-2 border-dashed border-ue-border rounded-xl">
      Sin datos suficientes para graficar
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { Entry, GlucoseEntry } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  entries: Entry[]
}>();

const glucoseEntries = computed(() => {
  return props.entries
    .filter((e): e is GlucoseEntry => e.type === 'glucose')
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-20); // Últimas 20 lecturas
});

const chartData = computed(() => ({
  labels: glucoseEntries.value.map(e => {
    const date = new Date(e.timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }),
  datasets: [
    {
      label: 'Glucemia (mg/dL)',
      data: glucoseEntries.value.map(e => e.value),
      borderColor: '#F82F28', // UE Red 500
      backgroundColor: 'rgba(248, 47, 40, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#6F0714',
      pointBorderWidth: 2,
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#131819',
      titleFont: { size: 10, weight: 'bold' as const },
      bodyFont: { size: 12, weight: 'bold' as const },
      padding: 12,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    y: {
      min: 40,
      max: 250,
      grid: {
        color: 'rgba(233, 233, 238, 0.5)', // UE Border
      },
      ticks: {
        font: { size: 10, weight: 'bold' as const },
        color: '#9799AB'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: { size: 10, weight: 'bold' as const },
        color: '#9799AB'
      }
    }
  }
};
</script>
