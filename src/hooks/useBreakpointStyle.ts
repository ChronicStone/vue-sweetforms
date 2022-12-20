import { computed, ComputedRef, watch } from "vue"
import { BreakpointsInjectKey } from "@/constants/injectionKeys"
import { ComputeStyleModifier } from "@/utils"

interface BreakpointArrayItem {
    key: string
    value: any
}

interface BreakpointsConfig {
    reactiveBreakpoints: ComputedRef<BreakpointArrayItem[]>
    breakpointsDefObject: { [key: string]: number }
    breakpointsKeys: string[]
}

export const useBreakpointStyle = (styleString: string, { reactiveBreakpoints, breakpointsDefObject, breakpointsKeys }: BreakpointsConfig, transformKey?: string) => {    
    const mappedStyles = styleString.toString().split(' ').map(style => style.split(':').reverse()).map(([style, breakpoint]) => ({breakpoint: breakpoint ?? 'sm', style}))

    const breakpointStyle = breakpointsKeys.reduce((acc: any, breakpoint: string, index: number) => {
        let breakpointValue = mappedStyles.find(style => style.breakpoint === breakpoint)?.style ?? null
        if(!breakpointValue) {
            let currentIndex = index - 1
            while(!breakpointValue && currentIndex >= 0) {
                breakpointValue = mappedStyles.find(style => style.breakpoint === breakpointsKeys[currentIndex])?.style ?? null
                currentIndex--
            }
        }
        return { ...acc, [breakpoint]: breakpointValue }
    }, {})

    const currentBreakpointVal = computed(() => {
        const currentBreakpoint = reactiveBreakpoints.value.find(({ value }) => value.value)?.key ?? 'sm'
        return transformKey ? ComputeStyleModifier(breakpointStyle[currentBreakpoint], transformKey) : breakpointStyle[currentBreakpoint]
    })

    return currentBreakpointVal
}