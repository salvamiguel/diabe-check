<template>
  <div class="h-64 w-full">
    <Line v-if="hasChartData" :data="chartData" :options="chartOptions" />
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
import type { Entry, GlucoseEntry, UserProfile } from '../../types';

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
  profile?: (UserProfile & { id?: string }) | null
}>();

const glucoseEntries = computed(() => {
  return props.entries
    .filter((e): e is GlucoseEntry => e.type === 'glucose')
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-20); // Últimas 20 lecturas
});

const chartData = computed(() => {
  const entries = glucoseEntries.value;
  const min = props.profile?.settings.glucoseMin ?? 70;
  const max = props.profile?.settings.glucoseMax ?? 180;

  // Color each point based on range
  const pointBackgroundColors = entries.map(e => {
    if (e.value >= min && e.value <= max) return '#10B981'; // green
    return '#EF4444'; // red
  });

  return {
    labels: entries.map(e => {
      const date = new Date(e.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }),
    datasets: [
      {
        label: 'Rango Seguro (Máx)',
        data: entries.map(() => max),
        borderColor: '#9CA3AF',
        borderDash: [5, 5],
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        tension: 0,
        showLine: true,
      },
      {
        label: 'Rango Seguro (Mín)',
        data: entries.map(() => min),
        borderColor: '#9CA3AF',
        borderDash: [5, 5],
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        tension: 0,
        showLine: true,
      },
      {
        label: 'Glucemia (mg/dL)',
        data: entries.map(e => e.value),
        borderColor: '#F82F28', // UE Red 500
        backgroundColor: 'rgba(248, 47, 40, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: pointBackgroundColors,
        pointBorderColor: pointBackgroundColors,
        pointBorderWidth: 2,
      }
    ]
  };
});

const hasChartData = computed(() => {
  return !!(chartData.value.datasets && chartData.value.datasets[0] && chartData.value.datasets[0].data && chartData.value.datasets[0].data.length > 0);
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        font: { size: 10, weight: 'bold' as const },
        color: '#9799AB',
        boxWidth: 12,
        padding: 10,
        filter: (item: any) => item.text !== 'Rango Seguro (Máx)' && item.text !== 'Rango Seguro (Mín)'
      }
    },
    tooltip: {
      backgroundColor: '#131819',
      titleFont: { size: 10, weight: 'bold' as const },
      bodyFont: { size: 12, weight: 'bold' as const },
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      filter: (item: any) => item.datasetIndex === 2 // Only show main dataset
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
