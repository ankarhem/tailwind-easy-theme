import { Config } from 'tailwindcss';
import { easyTheme } from './index';

const config: Config = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    easyTheme({
      primary: '#ff0000',
    }),
  ],
};

export default config;
