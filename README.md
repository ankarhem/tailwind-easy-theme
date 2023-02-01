## Installation

```bash
pnpm i -D tailwind-easy-theme colord
```

## Usage

```javascript
const { easyTheme } = require('tailwind-easy-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    easyTheme({
      primary: '#ff0000',
      secondary: 'rgb(204, 0, 204)',
      accent: 'hsl(180, 100%, 40%)',
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
```

The hex value is given as the fallback value to the tailwind variable config. This means
the vscode autocomplete shows the color correctly, despite being a css variable!

![Showcase](https://user-images.githubusercontent.com/14110063/215893197-ffc6d510-5086-4db8-ada8-fcbc90fd7ce3.png)

## Options

```typescript
export type Options = {
  /** The prefix added to the key of a color. Defaults to `--color-` */
  prefix?: string;
};
```
