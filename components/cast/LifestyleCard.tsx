import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { getHobbyLabel, getHolidayStyleLabel } from "@/lib/cast-helpers";

type LifestyleCardProps = {
  hobbies: string[];
  holidayStyle: string[];
  locale: string;
};

export default function LifestyleCard({
  hobbies = [],
  holidayStyle = [],
  locale,
}: LifestyleCardProps) {
  const t = useTranslations();

  // Don't render if no data
  const hasData = hobbies?.length > 0 || holidayStyle?.length > 0;
  if (!hasData) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-airbnb-md space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        <h3 className="text-lg font-semibold text-deep">
          {t("cast.lifestyle")}
        </h3>
      </div>

      {/* Hobbies */}
      {hobbies?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎨</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.hobbies")}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 pl-7">
            {hobbies.map((hobby) => (
              <Badge
                key={hobby}
                variant="secondary"
                className="px-3 py-1.5 bg-gradient-to-r from-coral/10 to-rausch/10 text-deep border-coral/20 hover:bg-gradient-to-r hover:from-coral/20 hover:to-rausch/20 transition-colors"
              >
                {getHobbyLabel(hobby, locale)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Holiday Style */}
      {holidayStyle?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌴</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.holidayStyle")}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 pl-7">
            {holidayStyle.map((style) => (
              <Badge
                key={style}
                variant="secondary"
                className="px-3 py-1.5 bg-gradient-to-r from-info/10 to-success/10 text-deep border-info/20 hover:bg-gradient-to-r hover:from-info/20 hover:to-success/20 transition-colors"
              >
                {getHolidayStyleLabel(style, locale)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
