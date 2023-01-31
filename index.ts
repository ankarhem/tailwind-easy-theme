import { colord } from 'colord';
import { withOptions } from 'tailwindcss/plugin';

type HexColor<T extends string> = T extends `#${string}` ? T : never;

type ColorProps<T extends Record<string, string>> = {
  [K in keyof T]: HexColor<T[K]>;
};

const plugin = <T extends Record<string, string>>(colors: ColorProps<T>) => {
  let cssVariables: Record<string, string> = {};
  let themeSettings: Record<string, string> = {};

  Object.entries(colors).forEach(([key, value]) => {
    const hexColor = colors[key];

    // convert to 100, 100%, 100%
    const hslValue = colord(hexColor)
      .alpha(1)
      .toHslString()
      .replace(/hsl\((.*)\)/g, '$1');

    cssVariables[`--color-${key}`] = hslValue;
    // Set theme settings to use css variables and fallback to hex color
    // fallback is necessary for tailwind autocomplete to show colors
    themeSettings[key] = `hsl(var(--color-${key}, ${value}) / <alpha-value>)`;
  });

  return withOptions(
    () => {
      return function ({ addBase }) {
        addBase({
          [':root']: cssVariables,
        });
      };
    },
    () => {
      return {
        theme: {
          extend: {
            colors: themeSettings,
          },
        },
      };
    }
  )(colors);
};

export default plugin;
