export { MapArrayToObject, MapFormInitialState, MapFormRules, MapStepsAsFields, MapDependenciesAsObject, ResolveFromString } from "./formUtils"


export const fetchGet = async (url: string, method = 'GET', options = {}) => {
    try {
        const response = await fetch(url, { ...options, method }).then(response => response.json())
        return response
    } catch(err) {
        console.error(err)
        throw err
    }
}

export const GenerateLoremIpsumText = (length: number) => {
    const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    return loremIpsum.slice(0, length)
}