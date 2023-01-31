import { Config } from 'tailwindcss';
import cssVariables from './index';

const config: Config = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    cssVariables({
      primary: '#ff0000',
    }),
  ],
};

export default config;
