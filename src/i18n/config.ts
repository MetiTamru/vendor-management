export const locales = ["en", "am"] as const;
export const defaultLocale = "en";

/** Fixed default avoids ENVIRONMENT_FALLBACK / SSR–client markup mismatches. */
export const defaultTimeZone = "UTC";

export type Locale = (typeof locales)[number];
