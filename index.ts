import { colord } from 'colord';
import { withOptions } from 'tailwindcss/plugin';

export type Options = {
  /** The prefix added to the key of a color. Defaults to `--color-` */
  prefix?: string;
};

export const easyTheme = (
  colors: Record<string, string>,
  options?: Options
) => {
  let prefix = options?.prefix || '--color-';
  let cssVariables: Record<string, string> = {};
  let themeSettings: Record<string, string> = {};

  Object.keys(colors).forEach((key) => {
    const value = colors[key];
    const hexValue = colord(value).alpha(1).toHex();

    // convert to 100 100% 100%
    const hslValue = colord(value)
      .alpha(1)
      .toHslString()
      // remove hsl()
      .replace(/hsl\((.*)\)/g, '$1')
      // remove commas
      .replace(/,/g, '');

    cssVariables[`${prefix}${key}`] = hslValue;
    // Set theme settings to use css variables and fallback to hex color
    // fallback is necessary for tailwind autocomplete to show colors
    themeSettings[
      key
    ] = `hsl(var(${prefix}${key}, ${hexValue}) / <alpha-value>)`;
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
