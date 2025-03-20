<script setup lang="ts">
import { priceService, type IPrice } from '~/services/prices.service';
import Chart from '~/components/Chart.vue';

const data = ref<IPrice[]>([])
const from = ref("");
const to = ref("");
const activePeriod = ref("day");

const getDateRange = (period: string) => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = now;

  switch (period) {
    case 'day':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'custom':
        startDate = new Date(from.value);
        endDate = new Date(to.value);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);    
        break;
    default:
      startDate = new Date(0);
      break;
  }

  return { startDate, endDate };
};


const fetchData = async (period: string): Promise<void> => {
  activePeriod.value = period;
  const { startDate, endDate } = getDateRange(period);
  try {
    const response = await priceService.getPrices(startDate.toISOString(), endDate.toISOString());
    data.value = response;
  } catch (error) {
    console.error("Ошибка при загрузке данных", error);
  }
};

onMounted(async () => {
  await fetchData(activePeriod.value);
  setInterval(async () => {
    await fetchData(activePeriod.value); 
  }, 10000);
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
    <header class="max-w-6xl mx-auto mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold tracking-tight">Bitcoin Price Tracker</h1>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <div class="p-6 bg-gray-800 border-b border-gray-700">
        <div class="flex flex-wrap items-center gap-3">
          <div class="font-medium text-gray-400 mr-2">Time Period:</div>
          <button 
            @click="fetchData('day')" 
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activePeriod === 'day' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            24H
          </button>
          <button 
            @click="fetchData('week')" 
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activePeriod === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            7D
          </button>
          <button 
            @click="fetchData('month')" 
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activePeriod === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            1M
          </button>
          <button 
            @click="fetchData('year')" 
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activePeriod === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            1Y
          </button>
          <button 
            @click="activePeriod = 'custom'" 
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activePeriod === 'custom'
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            <span class="flex items-center">
              Custom
            </span>
          </button>
        </div>

        <div v-if="activePeriod === 'custom'" class="mt-4 bg-gray-700 p-4 rounded-lg">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-col">
              <label class="text-sm text-gray-300 mb-1">Start Date</label>
              <input 
                type="date" 
                v-model="from" 
                class="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div class="flex flex-col">
              <label class="text-sm text-gray-300 mb-1">End Date</label>
              <input 
                type="date" 
                v-model="to" 
                class="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div class="flex items-end">
              <button 
                @click="fetchData('custom')" 
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 bg-gray-900">
        <div v-if="data.length > 0" class="h-full w-full">
          <Chart :prices="data" />
        </div>
        <div v-else class="h-full w-full flex items-center justify-center">
          <div class="text-center">
            <p class="text-gray-400">Loading price data...</p>
          </div>
        </div>
      </div>

      <div v-if="data.length > 0" class="grid grid-cols-1 md:grid-cols-4 border-t border-gray-700">
        <div class="p-4 border-b md:border-b-0 md:border-r border-gray-700">
          <div class="text-sm text-gray-400">Current Price</div>
          <div class="text-xl font-bold">${{ Number(data[data.length - 1]?.price).toLocaleString() }}</div>
        </div>
        <div class="p-4 border-b md:border-b-0 md:border-r border-gray-700">
          <div class="text-sm text-gray-400">Last change</div>
          <div class="text-xl font-bold" :class="data.length > 1 && data[data.length - 1]?.price > data[data.length - 2]?.price ? 'text-green-500' : 'text-red-500'">
            {{ data.length > 1 ? ((data[data.length - 1]?.price - data[data.length - 2]?.price) / data[data.length - 2]?.price * 100).toFixed(2) : '0.00' }}%
          </div>
        </div>
        <div class="p-4 border-b md:border-b-0 md:border-r border-gray-700">
          <div class="text-sm text-gray-400">Lowest</div>
          <div class="text-xl font-bold">${{ data.length ? Number(Math.min(...data.map(p => p.price))).toLocaleString() : '0.00' }}</div>
        </div>
        <div class="p-4">
          <div class="text-sm text-gray-400">Highest</div>
          <div class="text-xl font-bold">${{ data.length ? Number(Math.max(...data.map(p => p.price))).toLocaleString() : '0.00' }}</div>
        </div>
      </div>
    </main>
  </div>
</template>