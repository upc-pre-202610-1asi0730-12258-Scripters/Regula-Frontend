import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_KEY = 'stock'

export const useInventoryUiStore = defineStore('inventoryUi', () => {
    const sectionKey = ref(DEFAULT_KEY)

    function setInventorySectionKey(key) {
        sectionKey.value = key || DEFAULT_KEY
    }

    function resetInventorySection() {
        sectionKey.value = DEFAULT_KEY
    }

    return {
        sectionKey,
        setInventorySectionKey,
        resetInventorySection,
    }
})
