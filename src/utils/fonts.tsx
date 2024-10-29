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
} as const;

// Create a type-safe theme configuration for fonts
export const typography = {
  // Headers
  h1: {
    fontFamily: FontFamilies.bodoni,
    fontWeight: FontWeights.bold,
  },
  h2: {
    fontFamily: FontFamilies.kalnia,
    fontWeight: FontWeights.bold,
  },
  h3: {
    fontFamily: FontFamilies.kanit,
    fontWeight: FontWeights.bold,
  },
  // Body text
  body1: {
    fontFamily: FontFamilies.kalnia,
    fontWeight: FontWeights.regular,
  },
  body2: {
    fontFamily: FontFamilies.kanit,
    fontWeight: FontWeights.regular,
  },
  // Code blocks
  code: {
    fontFamily: FontFamilies.mono,
    fontWeight: FontWeights.regular,
  },
  // Future-oriented text (could be used for statistics or forecasts)
  future: {
    fontFamily: FontFamilies.tomorrow,
    fontWeight: FontWeights.regular,
  }
} as const;

// Helper function to get font family with fallbacks
export const getFontFamily = (font: keyof typeof FontFamilies) => {
  const fallbacks = {
    [FontFamilies.bodoni]: 'serif',
    [FontFamilies.kalnia]: 'serif',
    [FontFamilies.kanit]: 'sans-serif',
    [FontFamilies.mono]: 'monospace',
    [FontFamilies.tomorrow]: 'sans-serif',
  };

  return `${FontFamilies[font]}, ${fallbacks[FontFamilies[font]]}`;
};