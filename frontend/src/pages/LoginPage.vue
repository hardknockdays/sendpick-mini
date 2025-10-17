<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-md w-80">
      <h1 class="text-2xl font-bold mb-4 text-center">SendPick Login</h1>
      <input v-model="username" type="text" placeholder="Username"
        class="border rounded w-full p-2 mb-3" />
      <button @click="login"
        class="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">Login</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')

function login() {
  if (!username.value) return alert('Masukkan username!')
  localStorage.setItem('user', username.value)
  router.push('/dashboard')
}
</script>
