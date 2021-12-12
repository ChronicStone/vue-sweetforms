import { gridMap } from "../constants/twClasses"
type TailwindBreakpoint = '' | 'sm:' | 'md:' | 'lg:' | 'xl:'
type TailwindSizeCtrl = 'grid-cols' | 'col-span'
type TailwindSizeList = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'
type TailwindSize = `${TailwindSizeCtrl}-${TailwindSizeList}`
type TailwindSizeWithBreakpoint = `${TailwindBreakpoint}${TailwindSize}`

interface BreakpointsObject {
    sm?: string | number
    md?: string | number
    lg?: string | number
    xl?: string | number
}

interface DefaultFormStyles {
    maxHeight: BreakpointsObject,
    maxWidth: BreakpointsObject,
    grid: string,
    col: string,
}

type StylesProps = 'maxHeight' | 'maxWidth'

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
    },
    grid: '1 md:2 lg:4 xl:8',
    col: '1 md:1 lg:2 xl:4'
}

export const TransformHexToHexOpacity = (hex: string, opacity: number) => {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const ComputeSizeFromBreakpoint = (params: BreakpointsObject, defaultParams: BreakpointsObject, breakpoints: any) => {
    if(breakpoints.xl) return params['xl'] ?? defaultParams['xl']
    else if(breakpoints.lg) return params['lg'] ?? defaultParams['lg']
    else if(breakpoints.md) return params['md'] ?? defaultParams['md']
    else return params['sm'] ?? defaultParams['sm']
}

export const ComputePropSize = (property: any, propKey: StylesProps, breakpoints: any) => {
    console.log({ property, propKey, val: ComputeSizeFromBreakpoint({}, defaultFormStyles[propKey], breakpoints) })
    if(!property) return ComputeSizeFromBreakpoint({}, defaultFormStyles[propKey], breakpoints)
    else if (typeof property === 'string') return property
    else if (typeof property === 'number') return ['maxWidth', 'maxHeight'].includes(propKey) ? `${property}vh` : property
    else if (typeof property === 'object') return ComputeSizeFromBreakpoint(property, defaultFormStyles[propKey], breakpoints)
}

export const ComputeTwGridBreakpoint = (breakpoints: string | number, target: 'grid' | 'col') => (breakpoints ?? defaultFormStyles[target]).toString().split(' ').map((b: string) => gridMap[b][target]).join(' ')

