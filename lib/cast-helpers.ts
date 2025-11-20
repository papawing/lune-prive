// Cast Profile Helper Functions

import { LocalizedText } from "@/types/cast";

/**
 * Extract localized text from multilingual JSON field
 */
export function getLocalizedText(
  content: LocalizedText | string | null | undefined,
  locale: string
): string {
  if (!content) return "";

  // If it's already a string (legacy data), return as is
  if (typeof content === "string") return content;

  // Extract text for current locale, fallback to English, then first available
  const localeKey = locale as keyof LocalizedText;
  return content[localeKey] || content.en || Object.values(content)[0] || "";
}

/**
 * Format birthday for display (e.g., "Jan 3")
 */
export function formatBirthday(
  birthday: Date | string | null | undefined,
  locale: string = "en"
): string {
  if (!birthday) return "";

  const date = typeof birthday === "string" ? new Date(birthday) : birthday;

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Hobby translation keys mapping
 */
const HOBBY_TRANSLATIONS: Record<string, { en: string; zh: string; ja: string }> = {
  gourmet: { en: "Gourmet", zh: "美食", ja: "グルメ" },
  beauty: { en: "Beauty", zh: "美容", ja: "美容" },
  music: { en: "Music", zh: "音乐", ja: "音楽" },
  travel: { en: "Travel", zh: "旅行", ja: "旅行" },
  sports: { en: "Sports", zh: "运动", ja: "スポーツ" },
  art: { en: "Art", zh: "艺术", ja: "アート" },
  reading: { en: "Reading", zh: "阅读", ja: "読書" },
  movies: { en: "Movies", zh: "电影", ja: "映画" },
  gaming: { en: "Gaming", zh: "游戏", ja: "ゲーム" },
  outdoor: { en: "Outdoor", zh: "户外", ja: "アウトドア" },
  shopping: { en: "Shopping", zh: "购物", ja: "ショッピング" },
  cooking: { en: "Cooking", zh: "烹饪", ja: "料理" },
  fitness: { en: "Fitness", zh: "健身", ja: "フィットネス" },
  photography: { en: "Photography", zh: "摄影", ja: "写真" },
  dancing: { en: "Dancing", zh: "舞蹈", ja: "ダンス" },
};

/**
 * Get localized hobby label
 */
export function getHobbyLabel(hobby: string, locale: string = "en"): string {
  const translation = HOBBY_TRANSLATIONS[hobby];
  if (!translation) return hobby;

  const localeKey = locale as keyof typeof translation;
  return translation[localeKey] || translation.en || hobby;
}

/**
 * Holiday style translation keys mapping
 */
const HOLIDAY_STYLE_TRANSLATIONS: Record<string, { en: string; zh: string; ja: string }> = {
  home: { en: "Home", zh: "居家", ja: "家" },
  cafe: { en: "Café", zh: "咖啡厅", ja: "カフェ" },
  shopping: { en: "Shopping", zh: "购物", ja: "ショッピング" },
  travel: { en: "Travel", zh: "旅行", ja: "旅行" },
  nature: { en: "Nature", zh: "自然", ja: "自然" },
  cultural: { en: "Cultural", zh: "文化", ja: "文化" },
  nightlife: { en: "Nightlife", zh: "夜生活", ja: "ナイトライフ" },
  sports: { en: "Sports", zh: "运动", ja: "スポーツ" },
  spa: { en: "Spa", zh: "水疗", ja: "スパ" },
  adventure: { en: "Adventure", zh: "冒险", ja: "アドベンチャー" },
};

/**
 * Get localized holiday style label
 */
export function getHolidayStyleLabel(style: string, locale: string = "en"): string {
  const translation = HOLIDAY_STYLE_TRANSLATIONS[style];
  if (!translation) return style;

  const localeKey = locale as keyof typeof translation;
  return translation[localeKey] || translation.en || style;
}

/**
 * Format height for display (e.g., "150 cm")
 */
export function formatHeight(height: number | null | undefined): string {
  if (!height) return "";
  return `${height} cm`;
}

/**
 * Format weight for display (e.g., "45 kg")
 */
export function formatWeight(weight: number | null | undefined): string {
  if (!weight) return "";
  return `${weight} kg`;
}

/**
 * Format bust size for display (e.g., "B Cup")
 */
export function formatBustSize(
  bustSize: string | null | undefined,
  locale: string = "en"
): string {
  if (!bustSize) return "";

  const cupLabel = locale === "zh" ? "罩杯" : locale === "ja" ? "カップ" : "Cup";
  return `${bustSize} ${cupLabel}`;
}
