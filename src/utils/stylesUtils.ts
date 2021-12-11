import { Breakpoints } from "@vueuse/core"

interface BreakpointsObject {
    sm?: string
    md?: string
    lg?: string
    xl?: string
}

interface DefaultFormStyles {
    maxHeight: BreakpointsObject,
    maxWidth: BreakpointsObject,
}

type StylesProps = 'maxHeight' | 'maxWidth' | 'gridSize'

const defaultFormStyles: DefaultFormStyles = {
    maxHeight: {
        sm: '95vh',
        md: '90vh',
        lg: '90vh',
        xl: '90vh'
    },
    maxWidth: {
        sm: '95vw',
        md: '85vw',
        lg: '75vw',
        xl: '65vw'
    }
}


export const ComputeSizeFromBreakpoint = (params: BreakpointsObject, defaultParams: BreakpointsObject, breakpoints: any) => {
    if(breakpoints.xl.value) return params['xl'] ?? defaultParams['xl']
    else if(breakpoints.lg.value) return params['lg'] ?? defaultParams['lg']
    else if(breakpoints.md.value) return params['md'] ?? defaultParams['md']
    else return params['sm'] ?? defaultParams['sm']
}

export const ComputePropSize = (formOptions: any, property: StylesProps, breakpoints: any) => {
    if(!formOptions[property]) return ComputeSizeFromBreakpoint({}, defaultFormStyles[property], breakpoints)
    else if (typeof formOptions[property] === 'string') return formOptions[property]
    else if (typeof formOptions[property] === 'number') return `${formOptions[property]}vh`
    else if (typeof formOptions[property] === 'object') return ComputeSizeFromBreakpoint(formOptions[property], defaultFormStyles[property], breakpoints)
}