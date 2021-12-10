import { deepmerge } from "deepmerge-ts"

export const DefaultThemeOverrides = {
    "common": {
        "borderRadius": "6px",
        "primaryColor": "#319795FF",
        "primaryColorHover": "#3BB3B1FF",
        "primaryColorPressed": "#2A807EFF",
        "primaryColorSuppl": "#3B918FFF",
        "heightTiny": "26px",
        "heightSmall": "32px",
        "heightMedium": "38px",
        "heightLarge": "44px",
        "heightHuge": "50px"
    },
    "DataTable": {
        "borderRadius": "15px"
    },
    "TableHeader": {
        "borderRadius": "8px"
    },
    "Alert": {
        "padding": "5px 8px"
    }
}

const _lightThemeOverrides = {

}

const _darkThemeOverrides = {
    "common": {
        "primaryColor": "#AC96F9FF",
        "primaryColorHover": "#C1AFFFFF",
        "primaryColorPressed": "#977AFDFF",
        "bodyColor": "rgba(29, 30, 39, 1)",
        "cardColor": "rgba(40, 41, 54, 1)",
        "modalColor": "rgba(40, 41, 54, 1)",
        "scrollbarWidth": "5px",
        "fontFamily": "Lato",
        "popoverColor": "rgba(41, 41, 54, 1)"
    },
    "Input": {
        "color": "rgba(62, 64, 83, 1)"
    },
    "InternalSelection": {
        "color": "rgba(62, 64, 83, 1)"
    },
    "ColorPicker": {
        "color": "rgba(62, 64, 83, 1)"
    },
    "Slider": {
        "fillColor": "rgba(185, 38, 180, 1)"
    },
}

export const DarkThemeOverrides = deepmerge(DefaultThemeOverrides, _darkThemeOverrides)
export const LightThemeOverrides = deepmerge(DefaultThemeOverrides, _lightThemeOverrides)