import { computed, ComputedRef, watch } from "vue";
import { BreakpointsInjectKey } from "~/constants/injectionKeys";
import { StyleModifierTransformKey } from "~/types/utils";
import { computeStyleModifier } from "~/utils/dom/computeStyleModifier";

interface BreakpointArrayItem {
    key: string;
    value: any;
}

interface BreakpointsConfig {
    reactiveBreakpoints: ComputedRef<BreakpointArrayItem[]>;
    breakpointsKeys: string[];
}

export const useBreakpointStyle = (
    styleString: string | number | boolean,
    { reactiveBreakpoints, breakpointsKeys }: BreakpointsConfig,
    transformKey?: StyleModifierTransformKey,
) => {
    const mappedStyles = styleString
        .toString()
        .split(" ")
        .map((style) => style.split(":").reverse())
        .map(([style, breakpoint]) => ({ breakpoint: breakpoint ?? "sm", style }));

    const breakpointStyle = breakpointsKeys.reduce((acc: any, breakpoint: string, index: number) => {
        let breakpointValue = mappedStyles.find((style) => style.breakpoint === breakpoint)?.style ?? null;
        if (!breakpointValue) {
            let currentIndex = index - 1;
            while (!breakpointValue && currentIndex >= 0) {
                breakpointValue = mappedStyles.find((style) => style.breakpoint === breakpointsKeys[currentIndex])?.style ?? null;
                currentIndex--;
            }
        }
        return { ...acc, [breakpoint]: breakpointValue };
    }, {});

    const currentBreakpointVal = computed(() => {
        const currentBreakpoint = reactiveBreakpoints?.value?.find(({ value }) => value.value)?.key ?? "sm";
        return transformKey ? computeStyleModifier(breakpointStyle[currentBreakpoint], transformKey) : breakpointStyle[currentBreakpoint];
    });

    return currentBreakpointVal;
};
