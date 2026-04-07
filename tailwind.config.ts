import type { Config } from 'tailwindcss';
import preset from './src/styles/tailwind.preset';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [preset as Config],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
