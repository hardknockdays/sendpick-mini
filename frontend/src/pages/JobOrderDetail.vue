<template>
  <div class="p-6">
    <router-link to="/dashboard" class="text-blue-600 hover:underline">← Back</router-link>
    <h1 class="text-3xl font-bold my-4">Job Order #{{ id }}</h1>

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
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const manifests = ref([])

onMounted(async () => {
  const res = await axios.get(`http://localhost:3000/api/job-orders/${id}/manifests`)
  manifests.value = res.data
})
</script>
