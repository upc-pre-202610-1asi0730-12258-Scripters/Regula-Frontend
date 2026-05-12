import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionShellStore = defineStore('session-shell', () => {
  const unreadNotifications = ref(3)

  return {
    unreadNotifications,
  }
})
