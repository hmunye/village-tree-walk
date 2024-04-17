type ColorValueHex = `#${string}`;

export type ColorScheme = {
  background: ColorValueHex;
  foreground: ColorValueHex;
  primary: ColorValueHex;
  secondary: ColorValueHex;
  destructive: ColorValueHex;
  muted: ColorValueHex;
};

export type Tree = {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
  dbh: number;
  species: string;
  description: string;
  created_at: string;
  updated_at: string;
};
