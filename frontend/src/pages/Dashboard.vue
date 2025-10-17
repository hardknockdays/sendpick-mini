<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center">Job Order List</h1>

    <!-- Search -->
    <div class="mb-4 flex justify-end">
      <input
        v-model="search"
        type="text"
        placeholder="Search Customer..."
        class="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th
              class="border border-gray-300 p-2 text-left cursor-pointer"
              @click="sortBy('customer_name')"
            >
              Customer
            </th>
            <th
              class="border border-gray-300 p-2 text-left cursor-pointer"
              @click="sortBy('origin')"
            >
              Origin
            </th>
            <th
              class="border border-gray-300 p-2 text-left cursor-pointer"
              @click="sortBy('destination')"
            >
              Destination
            </th>
            <th
              class="border border-gray-300 p-2 text-left cursor-pointer"
              @click="sortBy('status')"
            >
              Status
            </th>
            <th class="border border-gray-300 p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="jo in filteredJobOrders"
            :key="jo.id"
            class="hover:bg-gray-50 even:bg-gray-50"
          >
            <td class="border border-gray-300 p-2">{{ jo.customer_name }}</td>
            <td class="border border-gray-300 p-2">{{ jo.origin }}</td>
            <td class="border border-gray-300 p-2">{{ jo.destination }}</td>
            <td class="border border-gray-300 p-2">{{ jo.status }}</td>
            <td class="border border-gray-300 p-2">
              <router-link
                :to="`/job/${jo.id}`"
                class="text-blue-600 hover:underline"
                >Detail</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const jobOrders = ref([])
const search = ref('')
const sortKey = ref('customer_name')
const sortAsc = ref(true)

// Fetch Job Orders
onMounted(async () => {
  const res = await axios.get('http://localhost:3000/api/job-orders')
  jobOrders.value = res.data
})

// Computed filtered & sorted
const filteredJobOrders = computed(() => {
  let data = jobOrders.value

  // Search filter
  if (search.value) {
    const s = search.value.toLowerCase()
    data = data.filter(j => j.customer_name.toLowerCase().includes(s))
  }

  // Sort
  data.sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })

  return data
})

// Sort function
function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}
</script>
