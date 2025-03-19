<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  prices: Array
});

const lastPrice = computed(() => {
  if (!props.prices || props.prices.length === 0) return null;
  return props.prices[props.prices.length - 1].price;
});

const priceChange = computed(() => {
  if (!props.prices || props.prices.length < 2) return 0;
  const first = props.prices[0].price;
  const last = props.prices[props.prices.length - 1].price;
  return ((last - first) / first) * 100;
});

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'area',
      height: '100%',
      width: '100%',
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          download: false
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
      background: 'transparent',
      foreColor: '#a0aec0',
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: [priceChange.value >= 0 ? '#48bb78' : '#f56565']
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    title: {
      text: 'BTC/USD Price Chart',
      align: 'left',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#f7fafc'
      }
    },
    grid: {
      borderColor: '#2d3748',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: priceChange.value >= 0 ? 'rgba(72, 187, 120, 0.8)' : 'rgba(245, 101, 101, 0.8)',
            opacity: 0.5
          },
          {
            offset: 100,
            color: priceChange.value >= 0 ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
            opacity: 0.1
          },
        ]
      },
    },
    yaxis: {
      title: {
        text: 'Price (USD)',
        style: {
          color: '#a0aec0'
        }
      },
      labels: {
        formatter: function(val) {
          return '$' + val.toLocaleString();
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      },
      tooltip: {
        enabled: false
      }
    },
    tooltip: {
      shared: false,
      theme: 'dark',
      y: {
        formatter: function(val) {
          return '$' + val.toLocaleString();
        }
      },
      x: {
        format: 'dd MMM yyyy HH:mm'
      },
      style: {
        fontSize: '12px',
        fontFamily: 'system-ui'
      }
    }
  };
});

const series = computed(() => {
  if (!props.prices || props.prices.length === 0) {
    return [{ name: "Bitcoin Price", data: [] }];
  }
  return [{
    name: "Bitcoin Price",
    data: props.prices.map(p => [Date.parse(p.timestamp), p.price])
  }];
});
</script>   

<template>
  <div class="relative h-full w-full">
    <div class="absolute top-0 left-1/2 bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg z-10">
      <div class="flex items-center">
        <div class="flex flex-col mr-4">
          <span class="text-xs text-gray-400">Current Price</span>
          <span class="text-lg font-bold">${{ Number(lastPrice).toLocaleString() }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-gray-400">Change</span>
          <span :class="[
            'text-sm font-bold flex items-center',
            priceChange >= 0 ? 'text-green-500' : 'text-red-500'
          ]">
            {{ priceChange.toFixed(2) }}%
          </span>
        </div>
      </div>
    </div>
    
    <ClientOnly>
      <apexchart 
        type="area" 
        :options="chartOptions" 
        :series="series">
      </apexchart>
    </ClientOnly>
  </div>
</template>