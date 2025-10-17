<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Job Order List</h1>
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Customer</th>
          <th class="border p-2">Origin</th>
          <th class="border p-2">Destination</th>
          <th class="border p-2">Status</th>
          <th class="border p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="jo in jobOrders" :key="jo.id" class="hover:bg-gray-50">
          <td class="border p-2">{{ jo.customer_name }}</td>
          <td class="border p-2">{{ jo.origin }}</td>
          <td class="border p-2">{{ jo.destination }}</td>
          <td class="border p-2">{{ jo.status }}</td>
          <td class="border p-2">
            <router-link :to="`/job/${jo.id}`" class="text-blue-600 hover:underline">Detail</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const jobOrders = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/api/job-orders')
  jobOrders.value = res.data
})
</script>
