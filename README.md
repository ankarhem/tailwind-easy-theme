## Installation

```bash
pnpm i -D tailwind-easy-theme colord
```

## Usage

```javascript
const { Theme } = require('tailwind-easy-theme');

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
```

This config create the tailwind classes and generate the necessary css and inject it. The color is converted to hsl values, so that opacity works as expected.

Generated CSS for this example:

```css
:root {
  --color-somecolor: 247 100% 95%;
  --color-primary: 0 100% 90%;
  --color-primary-100: 0 100% 90%;
  --color-primary-200: 0 100% 80%;
  --color-primary-300: 0 100% 70%;
  --color-primary-400: 0 100% 60%;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: 222 47% 11%;
    --color-primary-100: 222 47% 11%;
    --color-primary-200: 217 33% 17%;
    --color-primary-300: 215 25% 27%;
    --color-primary-400: 215 19% 35%;
  }
}

[data-theme='cool-theme'] {
  --color-somecolor: 0 0% 33%;
}

[data-theme='dark'] {
  --color-primary: 222 47% 11%;
  --color-primary-100: 222 47% 11%;
  --color-primary-200: 217 33% 17%;
  --color-primary-300: 215 25% 27%;
  --color-primary-400: 215 19% 35%;
}
```

The hex value is given as the fallback value to the tailwind variable config. This means
the vscode autocomplete shows the color correctly, despite being a css variable!

![Showcase](https://user-images.githubusercontent.com/14110063/215893197-ffc6d510-5086-4db8-ada8-fcbc90fd7ce3.png)

## Options

```typescript
export type Options = {
  /** The prefix added to the key of a color. Defaults to `--color-` */
  prefix?: string;
  /** The selector to add the css variables to. Defaults to `:root` */
  selector?: string;
};
```

```typescript
type VariantOptions = {
  /** The selector to add the css variables to. If not specified will use main theme's selector. */
  selector?: string;
  /** @example `@media (prefers-color-scheme: dark)` */
  mediaQuery?: string;
};
```
