import Scrollbar from 'tailwind-scrollbar'

module.exports = {
    plugins: [
        Scrollbar
    ],
    extend: {
        colors: {
            'primary': '#006976',
        }
    },
    variants: {
        scrollbar: ['hover']
    }
}