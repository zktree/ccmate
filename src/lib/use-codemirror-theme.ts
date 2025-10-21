import { useTheme } from "next-themes";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";

export function useCodeMirrorTheme() {
  const { theme, systemTheme } = useTheme();

  // Determine the actual theme being applied
  // If theme is "system", use the systemTheme value
  const actualTheme = theme === "system" ? systemTheme : theme;

  return actualTheme === "dark" ? vscodeDark : vscodeLight;
}