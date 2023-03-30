const { Theme } = require('./build/index.js');

const theme = new Theme({
  somecolor: '#e9e6ff',
  primary: {
    DEFAULT: '#ffcccc',
    100: '#ffcccc',
    200: '#ff9999',
    300: '#ff6666',
    400: '#ff3333',
  },
});

const darkMode = theme.variant(
  {
    primary: {
      DEFAULT: '#0f172a',
      400: '#475569',
      300: '#334155',
      200: '#1e293b',
      100: '#0f172a',
    },
  },
  {
    mediaQuery: '@media (prefers-color-scheme: dark)',
  }
);

const coolTheme = theme.variant(
  {
    somecolor: '#555',
  },
  {
    selector: '[data-theme="cool-theme"]',
  }
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    theme.create({
      '[data-theme="dark"]': darkMode,
    }),
  ],
};
