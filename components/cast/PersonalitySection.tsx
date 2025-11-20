import { useTranslations } from "next-intl";
import { getLocalizedText } from "@/lib/cast-helpers";
import type { LocalizedText } from "@/types/cast";

type PersonalitySectionProps = {
  personality?: LocalizedText | string | null;
  appearance?: LocalizedText | string | null;
  serviceStyle?: LocalizedText | string | null;
  preferredType?: LocalizedText | string | null;
  locale: string;
};

export default function PersonalitySection({
  personality,
  appearance,
  serviceStyle,
  preferredType,
  locale,
}: PersonalitySectionProps) {
  const t = useTranslations();

  // Don't render if no data
  const hasData = personality || appearance || serviceStyle || preferredType;
  if (!hasData) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-airbnb-md space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">💫</span>
        <h3 className="text-lg font-semibold text-deep">{t("cast.about")}</h3>
      </div>

      {/* Personality Type */}
      {personality && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.personality")}
            </h4>
          </div>
          <p className="text-light leading-relaxed pl-7">
            {getLocalizedText(personality, locale)}
          </p>
        </div>
      )}

      {/* Appearance Style */}
      {appearance && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">👗</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.appearance")}
            </h4>
          </div>
          <p className="text-light leading-relaxed pl-7">
            {getLocalizedText(appearance, locale)}
          </p>
        </div>
      )}

      {/* Service Style */}
      {serviceStyle && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💝</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.serviceStyle")}
            </h4>
          </div>
          <p className="text-light leading-relaxed pl-7">
            {getLocalizedText(serviceStyle, locale)}
          </p>
        </div>
      )}

      {/* Divider */}
      {preferredType && (personality || appearance || serviceStyle) && (
        <div className="border-t border-gray-100"></div>
      )}

      {/* Preferred Member Type */}
      {preferredType && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💕</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.preferences")}
            </h4>
          </div>
          <div className="space-y-2 pl-7">
            <div className="flex items-center gap-2">
              <span className="text-base">💖</span>
              <h5 className="text-xs font-medium text-light uppercase tracking-wide">
                {t("cast.preferredType")}
              </h5>
            </div>
            <p className="text-light leading-relaxed">
              {getLocalizedText(preferredType, locale)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
