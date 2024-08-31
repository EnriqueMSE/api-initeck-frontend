<!-- src/components/BarChart.vue -->
<template>
    <div>
      <BarChart :chartData="chartData" :chartOptions="chartOptions" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Bar } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default defineComponent({
    name: 'BarChart',
    components: {
      BarChart: Bar
    },
    setup() {
      const chartData = ref({
        labels: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
          {
            label: 'Sales',
            backgroundColor: '#42A5F5',
            data: [40, 20, 60, 30, 80, 50, 90, 70, 110, 85, 120, 150]
          }
        ]
      });
  
      const chartOptions = ref({
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sales by Month'
          }
        }
      });
  
      return {
        chartData,
        chartOptions
      };
    }
  });
  </script>
  