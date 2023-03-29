## Installation

```bash
pnpm i -D tailwind-easy-theme colord
```

## Usage

```javascript
const { Theme } = require("tailwind-easy-theme");
const colors = require("tailwindcss/colors");

const themes = {
  light: {
    somecolor: "#e9e6ff",
    blue: colors.blue
    primary: {
      100: "#ffcccc",
      200: "#ff9999",
      300: "#ff6666",
      400: "#ff3333",
      500: "#ff0000",
      600: "#cc0000",
      700: "#990000",
      800: "#660000",
      900: "#330000"
    },
  },
  dark: {
    primary: {
      DEFAULT: "#0f172a",
      950: "#f8fafc",
      900: "#f1f5f9",
      800: "#e2e8f0",
      700: "#cbd5e1",
      600: "#94a3b8",
      500: "#64748b",
      400: "#475569",
      300: "#334155",
      200: "#1e293b",
      100: "#0f172a",
      50: "#020617",
    },
  },
};

const theme = new Theme(themes.light);

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
