<template>
  <div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 p-6">
    <div class="max-w-5xl mx-auto space-y-8">
      <!-- Back -->
      <router-link
        to="/dashboard"
        class="inline-block text-blue-400 hover:text-blue-300 transition-colors mb-2"
      >
        ← Back
      </router-link>

      <!-- Header -->
      <div
        class="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1
            class="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text drop-shadow-lg"
          >
            Job Order #{{ id }}
          </h1>
          <p class="text-gray-400 mt-1">Customer: {{ jobOrder.customer_name || '-' }}</p>
        </div>

        <!-- Track via Map -->
        <button
          @click="trackMap"
          :disabled="!jobOrder.origin || !jobOrder.destination"
          class="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          🗺 Track via Map
        </button>
      </div>

      <!-- Job Info -->
      <div
        class="p-6 rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-lg"
      >
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-gray-400">Origin</p>
            <p class="text-lg font-medium text-blue-300">{{ jobOrder.origin || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-400">Destination</p>
            <p class="text-lg font-medium text-green-300">{{ jobOrder.destination || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-400">Status</p>
            <span
              :class="[
                'inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1',
                jobOrder.status === 'Pending'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                  : jobOrder.status === 'Ongoing'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                  : jobOrder.status === 'Delivered' || jobOrder.status === 'Completed'
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
              ]"
            >
              {{ jobOrder.status || '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Weather Info -->
      <div
        v-if="weather"
        class="p-6 rounded-xl border border-blue-700/30 bg-gradient-to-br from-blue-900/40 to-indigo-900/30 backdrop-blur-md shadow-lg hover:scale-[1.01] transition-transform"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-blue-300 mb-1">
              🌤 {{ jobOrder.destination }}
            </h2>
            <p class="text-gray-300 capitalize">
              {{ weather.weather[0].description }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-4xl font-bold text-blue-400">
              {{ (weather.main.temp - 273.15).toFixed(1) }}°C
            </p>
            <p class="text-sm text-gray-400">Feels like {{ (weather.main.feels_like - 273.15).toFixed(1) }}°C</p>
          </div>
        </div>
      </div>

      <!-- Manifest Table -->
      <div
        class="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/70 backdrop-blur-md shadow-2xl"
      >
        <table class="min-w-full border-collapse text-sm">
          <thead class="bg-gray-800/80 text-gray-300 uppercase text-xs">
            <tr>
              <th class="p-3 text-left border-b border-gray-700">Item</th>
              <th class="p-3 text-left border-b border-gray-700">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in manifests"
              :key="item.id"
              class="hover:bg-gray-800/60 even:bg-gray-900/40 transition-colors"
            >
              <td class="p-3 border-b border-gray-800">{{ item.item_name }}</td>
              <td class="p-3 border-b border-gray-800">{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const id = route.params.id

const manifests = ref([])
const jobOrder = ref({})
const weather = ref(null)

const fetchManifests = async () => {
  const res = await axios.get(`http://localhost:3000/api/job-orders/${id}/manifests`)
  manifests.value = res.data
}

const fetchJobOrder = async () => {
  const res = await axios.get(`http://localhost:3000/api/job-orders/${id}`)
  jobOrder.value = res.data

  // Ambil cuaca dari OpenWeather
  const API_KEY = 'YOUR_OPENWEATHER_API_KEY'
  try {
    const w = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${jobOrder.value.destination}&appid=${API_KEY}`
    )
    weather.value = w.data
  } catch (err) {
    console.error('Failed to fetch weather:', err)
  }
}

const trackMap = () => {
  if (!jobOrder.value.origin || !jobOrder.value.destination) {
    alert('Data job order belum tersedia.')
    return
  }
  const origin = encodeURIComponent(jobOrder.value.origin)
  const dest = encodeURIComponent(jobOrder.value.destination)
  window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, '_blank')
}

onMounted(() => {
  fetchManifests()
  fetchJobOrder()
})
</script>
