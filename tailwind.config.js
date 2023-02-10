const { Theme } = require('./build/index.js');

const theme = new Theme({
  primary: '#ff0000',
});

const darkMode = theme.variant(
  {
    primary: '#0000ff',
  },
  {
    mediaQuery: '@media (prefers-color-scheme: dark)',
  }
);

const coolTheme = theme.variant(
  {
    primary: '#00ff00',
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
