import { useTranslations } from "next-intl";
import {
  formatBustSize,
  formatHeight,
  formatWeight,
  formatBirthday,
} from "@/lib/cast-helpers";

type PhysicalAttributesCardProps = {
  bustSize?: string | null;
  height?: number | null;
  weight?: number | null;
  englishLevel?: string | null;
  birthday?: Date | null;
  locale: string;
};

export default function PhysicalAttributesCard({
  bustSize,
  height,
  weight,
  englishLevel,
  birthday,
  locale,
}: PhysicalAttributesCardProps) {
  const t = useTranslations();

  // Don't render if no data
  const hasData = bustSize || height || weight || englishLevel || birthday;
  if (!hasData) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-airbnb-md">
      {/* Header with emoji icon */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="text-lg font-semibold text-deep">
          {t("cast.physicalAttributes")}
        </h3>
      </div>

      {/* Grid layout - 2 columns on mobile, maintains on larger screens */}
      <div className="grid grid-cols-2 gap-4">
        {/* Bust Size */}
        {bustSize && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-light uppercase tracking-wide">
              {t("cast.bustSize")}
            </p>
            <p className="text-base font-semibold text-deep">
              {formatBustSize(bustSize, locale)}
            </p>
          </div>
        )}

        {/* Height */}
        {height && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-light uppercase tracking-wide">
              {t("cast.height")}
            </p>
            <p className="text-base font-semibold text-deep">
              {formatHeight(height)}
            </p>
          </div>
        )}

        {/* Weight */}
        {weight && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-light uppercase tracking-wide">
              {t("cast.weight")}
            </p>
            <p className="text-base font-semibold text-deep">
              {formatWeight(weight)}
            </p>
          </div>
        )}

        {/* English Level */}
        {englishLevel && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-light uppercase tracking-wide">
              {t("cast.englishLevel")}
            </p>
            <p className="text-base font-semibold text-deep">{englishLevel}</p>
          </div>
        )}

        {/* Birthday */}
        {birthday && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-light uppercase tracking-wide">
              {t("cast.birthday")}
            </p>
            <p className="text-base font-semibold text-deep">
              {formatBirthday(birthday, locale)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
