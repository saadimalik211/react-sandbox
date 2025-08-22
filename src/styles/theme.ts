export const theme = {
  colors: {
    background: '#333',
    gridBackground: '#444',
    panelBackground: '#222',
    tileBackground: '#666',
    assembledTileBackground: '#555',
    text: 'white',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  },
  borderRadius: {
    small: '6px',
    medium: '8px',
    large: '12px',
  },
  layout: {
    gridTemplateColumns: '2fr 1fr',
    gap: '1rem',
    minTileWidth: '100px',
  },
} as const;

export type Theme = typeof theme;
