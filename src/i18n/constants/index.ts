export const LOCALES = {
  en: {
    iso: "en-US",
    name: "English",
  },
  vi: {
    iso: "vi-VN",
    name: "Vietnamese",
  },
} as const satisfies Record<
  string,
  {
    name: string;
    iso: string;
  }
>;

export const LOCALE_DEFAULT: keyof typeof LOCALES = "en";
