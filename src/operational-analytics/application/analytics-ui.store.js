import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_TAB = 'generate'

export const useAnalyticsUiStore = defineStore('analyticsUi', () => {
    const activeTab = ref(DEFAULT_TAB)

    function setActiveTab(tab) {
        activeTab.value = tab || DEFAULT_TAB
    }

    function resetTab() {
        activeTab.value = DEFAULT_TAB
    }

    return {
        activeTab,
        setActiveTab,
        resetTab,
    }
})