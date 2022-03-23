


export const ScoresContentItem = () => ({
    type: 'object',

})

export const TextSize = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra large', value: 'xl' },
]

export const TextWeight = [
    { label: 'Regular', value: 'regular' },
    { label: 'Bold', value: 'bold' },
]

type ContentItemType = 'text' | 'grid' | 'progress'
export const IsItemType = (type: ContentItemType | ContentItemType[]) => ({
    dependencies: ['$parent'],
    condition: ({ $parent }: { $parent: { contentType: 'text' | 'grid' | 'progress' }}) => typeof type === 'string' ? $parent.contentType === type : type.includes($parent.contentType),
})