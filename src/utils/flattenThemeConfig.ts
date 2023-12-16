import type { FlatThemePropertyConfig, ThemePropertyConfig } from "../types";

export function flattenThemeConfig(
  config: ThemePropertyConfig,
  keyPrefix: string = ""
): FlatThemePropertyConfig {
  let flattenedThemeConfig: FlatThemePropertyConfig = {};

  Object.keys(config).forEach((_key) => {
    const key = keyPrefix ? `${keyPrefix}-${_key}` : _key;
    const value = config[_key];
    if (!value) return;

    if (typeof value === "string") {
      flattenedThemeConfig[key] = value;
      return;
    }

    const { DEFAULT, ...rest } = value;
    if (DEFAULT) {
      flattenedThemeConfig[key] = DEFAULT;
    }

    const nestedThemeProperty = flattenThemeConfig(rest, key);
    flattenedThemeConfig = { ...flattenedThemeConfig, ...nestedThemeProperty };
  });

  return flattenedThemeConfig;
}
