## Installation

```bash
pnpm i -D tailwind-easy-theme colord
```

## Usage

```javascript
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
```

This extends your colors with variables that resolve to css variables
and also adds all the given defaults to the `:root`. The color is converted to
hsl values, so that opacity works as expected.

```css
:root {
  --color-primary: 0 100% 50%;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: 240 100% 50%;
  }
}

[data-theme='cool-theme'] {
  --color-primary: 120 100% 50%;
}

[data-theme='dark'] {
  --color-primary: 240 100% 50%;
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
