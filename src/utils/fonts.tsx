// Core fonts
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/700.css';
import '@fontsource/kalnia/400.css';
import '@fontsource/kalnia/700.css';
import '@fontsource/kanit/400.css';
import '@fontsource/kanit/700.css';
import '@fontsource/reddit-mono/400.css';
import '@fontsource/tomorrow/400.css';
import '@fontsource/tomorrow/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';

// Define available font weights
export const FontWeights = {
  regular: 400,
  bold: 700,
} as const;

// Define font families
export const FontFamilies = {
  bodoni: 'Bodoni Moda',
  kalnia: 'Kalnia',
  kanit: 'Kanit',
  mono: 'Reddit Mono',
  tomorrow: 'Tomorrow',
  lato: 'Lato',
  playfair: 'Playfair Display',
} as const;

// Core typography settings
export const typography = {
  h1: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'inherit',
    marginBottom: '0.75 rem'
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 400,
    color: 'inherit',
    marginBottom: '0.75rem'
  },
  h3: {
    fontFamily: 'Kanit', // Sans-serif for interactive headers (tabs, expandable sections)
    fontSize: '1.25rem',
    fontWeight: 500,
    color: 'inherit',
    marginBottom: '0.5rem'
  },
  // Body text variants
  body1: {
    fontFamily: 'Kalnia', // Primary reading text
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5
  },
  body2: {
    fontFamily: 'Kanit', // Secondary text and UI elements
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43
  },
  // Special use cases
  code: {
    fontFamily: 'Reddit Mono', // For technical/numerical values
    fontSize: '0.875rem',
    fontWeight: 400
  },
  future: {
    fontFamily: 'Tomorrow', // For calculated/projected values
    fontSize: '0.875rem',
    fontWeight: 700
  }
};