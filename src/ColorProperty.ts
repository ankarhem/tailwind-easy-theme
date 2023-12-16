import { colord } from "colord";
import { ThemeProperty } from "./ThemeProperty";
import { ThemeValueFilterProps } from "./types";

/**
 * ColorProperty extends the base `ThemeProperty` class in order to transform
 * the output of CSS variable prefixes/values and CSS property values.
 */
export class ColorProperty extends ThemeProperty {
  // inject "color" into the generated CSS variable names:
  protected getBasePrefix(): string {
    return "color";
  }

  // convert CSS variable values to HSL format:
  protected filterCssVariableValue({
    themePropertyValue,
  }: ThemeValueFilterProps) {
    const hslValue = colord(themePropertyValue)
      .alpha(1)
      .toHslString()
      // remove hsl()
      .replace(/hsl\((.*)\)/g, "$1")
      // remove commas
      .replace(/,/g, "");

    return hslValue;
  }

  // convert CSS property values to use the generated CSS variables AND to fallback to hex color (fallback is necessary for tailwind autocomplete to show colors)
  protected filterCssPropertyValue({
    themePropertyKey,
    themePropertyValue,
  }: ThemeValueFilterProps) {
    const hexValue = colord(themePropertyValue).alpha(1).toHex();
    return `hsl(var(${this.getCssVariableName(
      themePropertyKey
    )}, ${hexValue}) / <alpha-value>)`;
  }
}
