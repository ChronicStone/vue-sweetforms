import { ref, watch, computed } from "vue"
import { useStorage } from "@vueuse/core"
export const useTheme = () => {
    const isDark = useStorage('darkTheme', true, localStorage)
    const themeName = computed(() => isDark ? 'dark' : 'light')
    const toggle = () => isDark.value = !isDark.value
    watch(() => isDark.value, (value) => { 
        const body = document.querySelector('body')
        if(value) body.classList.add('dark')
        else body.classList.remove('dark')
    }, { immediate: true })
    return { isDark, themeName, toggle }
}