import { colord } from "colord";
import { withOptions } from "tailwindcss/plugin";
import type { CSSRuleObject } from "tailwindcss/types/config";

export type CSSVarPrefix = `--${string}-`;

export type TailwindThemeColorProperty =
  | "colors"
  | "backgroundColor"
  | "textColor"
  | "borderColor"
  | "accentColor"
  | "ringColor"
  | "caretColor"
  | "divideColor"
  | "outlineColor"
  | "boxShadowColor"
  | "ringOffsetColor"
  | "placeholderColor"
  | "textDecorationColor";

export type Options = {
  /** The prefix added to the key of a color. Defaults to `--color-` */
  prefix?: CSSVarPrefix;
  /** The selector to add the css variables to. Defaults to `:root` */
  selector?: string;
  /**
   * The Tailwind theme property to apply this theme's color to. Defaults to `colors` (i.e. all color properties)
   * @example limit the theme to only `bg-*` classes by setting colorProperty to "backgroundColor"
   */
  colorProperty?: TailwindThemeColorProperty | TailwindThemeColorProperty[];
};

type VariantOptions = {
  /** The selector to add the css variables to. If not specified will use main theme's selector. */
  selector?: string;
  /** @example `@media (prefers-color-scheme: dark)` */
  mediaQuery?: string;
};

type Colors = Record<string, string>;
type ColorProps = Record<string, Colors | string>;
type PartialColorProps<PrimaryTheme extends ColorProps> = {
  [K in keyof PrimaryTheme]?: Partial<PrimaryTheme[K]>;
};

/**
 * ${prefix}${key}: <hsl-values>
 *
 *  @example
 *  {
 *    '--color-primary': '100 100% 100%'
 *  }
 * */
type CssVariables = Record<string, string>;

export class Theme<T extends ColorProps> {
  private prefix: CSSVarPrefix = "--color-";
  // private prefix: string = "--color-";
  private selector: string = ":root";
  private themeSettings: Record<string, string> = {};
  private cssRules: CSSRuleObject = {};
  private colorProperty:
    | TailwindThemeColorProperty
    | TailwindThemeColorProperty[] = "colors";

  constructor(colors: T, options?: Options) {
    this.prefix = options?.prefix || this.prefix;
    this.selector = options?.selector || this.selector;
    this.colorProperty = options?.colorProperty || this.colorProperty;

    const flattenedColors = this.flattenColors(colors);
    this.themeSettings = this.getThemeSettings(flattenedColors);

    const cssVariables = this.getColorValues(flattenedColors);
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
        .replace(/hsl\((.*)\)/g, "$1")
        // remove commas
        .replace(/,/g, "");

      (cssVariables as any)[`${this.prefix}${key}`] = hslValue;
    });

    return cssVariables;
  }

  private flattenColors(colors: PartialColorProps<ColorProps>, base = "") {
    let flattenedColors: Colors = {};

    Object.keys(colors).forEach((_key) => {
      const key = base ? `${base}-${_key}` : _key;
      const value = colors[_key];
      if (!value) return;

      if (typeof value === "string") {
        flattenedColors[key] = value;
        return;
      }

      const { DEFAULT, ...rest } = value;
      if (DEFAULT) {
        flattenedColors[key] = DEFAULT;
      }

      const nestedColors = this.flattenColors(rest, key);
      flattenedColors = { ...flattenedColors, ...nestedColors };
    });

    return flattenedColors;
  }

  variant(colors: PartialColorProps<T>, options?: VariantOptions) {
    const mediaQuery = options?.mediaQuery;

    const flattenedColors = this.flattenColors(colors);
    const cssVariables = this.getColorValues(flattenedColors);

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
        let config = { theme: { extend: {} } };

        if (Array.isArray(this.colorProperty)) {
          // apply themeSettings to multiple Tailwind theme color properties:
          this.colorProperty.forEach((property) => {
            config.theme.extend = {
              ...config.theme.extend,
              [property]: themeSettings,
            };
          });
        } else {
          // apply themeSettings to single Tailwind theme color property:
          config.theme.extend = {
            [this.colorProperty]: themeSettings,
          };
        }

        return config;
      }
    )({});
  }
}
