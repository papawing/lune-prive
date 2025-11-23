import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: string;
  label: string;
  count: number;
  description?: string;
  href: string;
  locale: string;
}

export default function StatsCard({
  icon,
  label,
  count,
  description,
  href,
  locale,
}: StatsCardProps) {
  return (
    <Link href={`/${locale}${href}`}>
      <Card className="group border-none shadow-airbnb-md hover:shadow-airbnb-hover transition-all duration-base cursor-pointer hover:scale-[1.02]">
        <CardContent className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">{icon}</span>
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-teal/10 transition-colors">
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-teal transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Count */}
          <p className="text-3xl font-bold text-deep mb-2">{count}</p>

          {/* Label */}
          <h3 className="text-sm font-semibold text-light mb-1">{label}</h3>

          {/* Description */}
          {description && (
            <p className="text-xs text-light/70">{description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
