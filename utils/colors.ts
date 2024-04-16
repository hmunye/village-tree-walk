export type ColorValueHex = `#${string}`;

interface ColorScheme {
  background: ColorValueHex;
  foreground: ColorValueHex;
  inactive: ColorValueHex;
  primary: ColorValueHex;
  secondary: ColorValueHex;
  accent: ColorValueHex;
  destructive: ColorValueHex;
  muted: ColorValueHex;
}

const colors: ColorScheme = {
  background: "#E9E2DA",
  foreground: "#060B11",
  inactive: "#0D1B1E",
  primary: "#14553A",
  secondary: "#",
  accent: "#",
  destructive: "#",
  muted: "#",
};

export default colors;
