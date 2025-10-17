<template>
  <div class="p-6">
    <router-link to="/dashboard" class="text-blue-600 hover:underline">← Back</router-link>
    <h1 class="text-3xl font-bold my-4">Job Order #{{ id }}</h1>

    <!-- Weather Info -->
    <div v-if="weather" class="mb-4 p-4 bg-blue-100 rounded">
      <p class="font-semibold">Destination: {{ jobOrder.destination }}</p>
      <p>Weather: {{ weather.weather[0].description }}</p>
      <p>Temperature: {{ (weather.main.temp - 273.15).toFixed(1) }}°C</p>
    </div>

    <!-- Manifest Table -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Item</th>
          <th class="border p-2">Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in manifests" :key="item.id">
          <td class="border p-2">{{ item.item_name }}</td>
          <td class="border p-2">{{ item.quantity }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Track via Map -->
    <button
      @click="trackMap"
      :disabled="!jobOrder.origin || !jobOrder.destination"
      class="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Track via Map
    </button>

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

// Ambil manifest
const fetchManifests = async () => {
  const res = await axios.get(`http://localhost:3000/api/job-orders/${id}/manifests`)
  manifests.value = res.data
}

// Ambil data job order (untuk origin & destination)
const fetchJobOrder = async () => {
  const res = await axios.get(`http://localhost:3000/api/job-orders/${id}`)
  jobOrder.value = res.data

  // Ambil cuaca destination via OpenWeather
  const API_KEY = 'YOUR_OPENWEATHER_API_KEY'
  try {
    const w = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${jobOrder.value.destination}&appid=${API_KEY}`)
    weather.value = w.data
  } catch (err) {
    console.error('Failed to fetch weather:', err)
  }
}

// Track via Google Maps
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
