<template>
  <div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <h1 class="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
        Job Order List
      </h1>

      <!-- Search -->
      <div class="mb-6 flex justify-end">
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Search Customer..."
          class="border border-gray-700 rounded-lg px-4 py-2 w-64 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto bg-gray-900/60 backdrop-blur-md rounded-lg shadow-xl border border-gray-800">
        <table class="min-w-full border-collapse">
          <thead class="bg-gray-800/80 text-gray-300 uppercase text-sm">
            <tr>
              <th
                class="border-b border-gray-700 p-3 text-left cursor-pointer hover:text-blue-400 transition-colors"
                @click="sortBy('customer_name')"
              >
                Customer
              </th>
              <th
                class="border-b border-gray-700 p-3 text-left cursor-pointer hover:text-blue-400 transition-colors"
                @click="sortBy('origin')"
              >
                Origin
              </th>
              <th
                class="border-b border-gray-700 p-3 text-left cursor-pointer hover:text-blue-400 transition-colors"
                @click="sortBy('destination')"
              >
                Destination
              </th>
              <th
                class="border-b border-gray-700 p-3 text-left cursor-pointer hover:text-blue-400 transition-colors"
                @click="sortBy('status')"
              >
                Status
              </th>
              <th class="border-b border-gray-700 p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="jo in filteredJobOrders"
              :key="jo.id"
              class="hover:bg-gray-800/60 even:bg-gray-900/40 transition-colors"
            >
              <td class="p-3 border-b border-gray-800">{{ jo.customer_name }}</td>
              <td class="p-3 border-b border-gray-800">{{ jo.origin }}</td>
              <td class="p-3 border-b border-gray-800">{{ jo.destination }}</td>
              <td class="p-3 border-b border-gray-800">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    jo.status === 'Pending'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                      : jo.status === 'Ongoing'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                      : jo.status === 'Completed'
                      ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                  ]"
                >
                  {{ jo.status }}
                </span>
              </td>
              <td class="p-3 border-b border-gray-800">
                <router-link
                  :to="`/job/${jo.id}`"
                  class="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Detail
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  search.value = '' // pastikan kosong tiap buka dashboard
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
