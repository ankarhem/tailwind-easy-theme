import { colord } from 'colord';
import { withOptions } from 'tailwindcss/plugin';
import type { CSSRuleObject } from 'tailwindcss/types/config';

export type Options = {
  /** The prefix added to the key of a color. Defaults to `--color-` */
  prefix?: string;
  /** The selector to add the css variables to. Defaults to `:root` */
  selector?: string;
};

type VariantOptions = {
  /** The selector to add the css variables to. If not specified will use main theme's selector. */
  selector?: string;
  /** @example `@media (prefers-color-scheme: dark)` */
  mediaQuery?: string;
};

type Colors = Record<string, string>;
type ColorList = Colors | Record<string, Record<string, string>>;

/**
 * ${prefix}${key}: <hsl-values>
 *
 *  @example
 *  {
 *    '--color-primary': '100 100% 100%'
 *  }
 * */
type CssVariables = Record<string, string>;

export class Theme<T extends ColorList> {
  private prefix: string = '--color-';
  private selector: string = ':root';
  private themeSettings: Record<string, string> = {};
  private cssRules: CSSRuleObject = {};

  constructor(colors: T, options?: Options) {
    this.prefix = options?.prefix || this.prefix;
    this.selector = options?.selector || this.selector;

    const merged = this.mergeColors(colors);
    this.themeSettings = this.getThemeSettings(merged);

    const cssVariables = this.getColorValues(merged);
    this.cssRules[this.selector] = cssVariables;
  }

  private getThemeSettings(colors: Colors) {
    let themeSettings: Record<string, string> = {};
    Object.keys(colors).forEach((key) => {
      const value = colors[key];
      if (!value) return;
      const hexValue = colord(value).alpha(1).toHex();
      // Set theme settings to use css variables and fallback to hex color
      // fallback is necessary for tailwind autocomplete to show colors
      themeSettings[
        key
      ] = `hsl(var(${this.prefix}${key}, ${hexValue}) / <alpha-value>)`;
    });

    return themeSettings;
  }

  private getColorValues(colors: Colors) {
    let cssVariables: CssVariables = {};

    Object.keys(colors).forEach((key) => {
      const value = colors[key];
      if (!value) return;

      // convert to 100 100% 100%
      const hslValue = colord(value)
        .alpha(1)
        .toHslString()
        // remove hsl()
        .replace(/hsl\((.*)\)/g, '$1')
        // remove commas
        .replace(/,/g, '');

      (cssVariables as any)[`${this.prefix}${key}`] = hslValue;
    });

    return cssVariables;
  }

  private mergeColors(colors: ColorList) {
    return Object.entries(colors).reduce((acc, [key, value]) => {
      if (typeof value === 'object') {
        const nestedEntries = Object.entries(value).map(([k, v]) => {
          return [k === "DEFAULT" ? key : `${key}-${k}`, v];
        });
        return Object.assign(acc, Object.fromEntries(nestedEntries));
      }
      return Object.assign(acc, { [key]: value });
    }, {});
  }

  variant(colors: ColorList, options?: VariantOptions) {
    const mediaQuery = options?.mediaQuery;

    const cssVariables = this.getColorValues(this.mergeColors(colors));

    if (mediaQuery) {
      this.cssRules[mediaQuery] = {
        [options?.selector || this.selector]: cssVariables,
      };
    }

    if (options?.selector) {
      this.cssRules[options.selector] = cssVariables;
    }

    return cssVariables;
  }

  create(base?: CSSRuleObject) {
    const cssRules = this.cssRules;
    const themeSettings = this.themeSettings;
    return withOptions(
      () => {
        return function ({ addBase }) {
          addBase({
            ...cssRules,
            ...base,
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
    )({});
  }
}
