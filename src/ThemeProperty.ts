import type {
  CssVariables,
  FlatThemePropertyConfig,
  ThemePropertyConfig,
  ThemePropertyOptions,
  ThemeValueFilterProps,
} from "./types";
import { flattenThemeConfig } from "./utils/flattenThemeConfig";

export class ThemeProperty {
  protected themeConfig: FlatThemePropertyConfig;
  protected prefix: string;

  constructor(themeConfig: ThemePropertyConfig, options: ThemePropertyOptions) {
    this.themeConfig = flattenThemeConfig(themeConfig);
    const basePrefix = this.getBasePrefix();
    this.prefix = basePrefix
      ? `${options.prefix}-${basePrefix}`
      : options.prefix;
  }

  getCSS() {
    let cssVariables: CssVariables = {};
    let cssProperties: FlatThemePropertyConfig = {};

    Object.keys(this.themeConfig).forEach((key) => {
      const value = this.themeConfig[key];
      if (!value) return;

      cssVariables[this.getCssVariableName(key)] = this.filterCssVariableValue({
        themePropertyKey: key,
        themePropertyValue: value,
      });

      cssProperties[key] = this.filterCssPropertyValue({
        themePropertyKey: key,
        themePropertyValue: value,
      });
    });

    return {
      cssVariables,
      cssProperties,
    };
  }

  protected getCssVariableName(key: string) {
    return `--${this.prefix}-${key}`;
  }

  /** This method is intended to be overridden by child classes that wish to inject a common keyword into the generated CSS variable name. eg. the ColorProperty child class injects the "color" keyword. */
  protected getBasePrefix(): string {
    return "";
  }

  /** Property-specific child classes can override this method to customize the value that gets assigned to ths property's generated CSS Variable. see the ColorProperty class as an example. */
  protected filterCssVariableValue({
    themePropertyValue,
  }: ThemeValueFilterProps) {
    return themePropertyValue;
  }

  /** Property-specific child classes can override this method to customize how their final value is set in the Tailwind theme config (i.e. the final CSS Property value); see the ColorProperty class as an example. */
  protected filterCssPropertyValue({
    themePropertyKey,
  }: ThemeValueFilterProps) {
    return `var(${this.getCssVariableName(themePropertyKey)})`;
  }
}
