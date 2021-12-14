module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true
  },
  purge: {
    content: ['./src/**/*.vue'],
    options: {
      whitelist: ['token']
    }
  },
  theme: {
    extend: {
      colors: {
        ui: {
          background: 'var(--color-ui-background)',
          sidebar: 'var(--color-ui-sidebar)',
          typo: 'var(--color-ui-typo)',
          primary: 'var(--color-ui-primary)',
          border: 'var(--color-ui-border)'
        }
      },
      spacing: {
        half: '0.125rem',
        sm: '24rem'
      }
    },
    container: {
      center: true,
      padding: '1rem'
    }
  },
  plugins: [
    require('tailwind-scrollbar')
  ]
}
