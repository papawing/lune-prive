import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface RequestCardProps {
  castName: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  requestedAt: Date;
  scheduledDate?: Date | null;
  location?: string | null;
  translations: {
    pending: string;
    confirmed: string;
    cancelled: string;
    completed: string;
    requestedOn: string;
    scheduledDate: string;
    location: string;
  };
}

export default function RequestCard({
  castName,
  status,
  requestedAt,
  scheduledDate,
  location,
  translations,
}: RequestCardProps) {
  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: translations.pending },
    CONFIRMED: { color: "bg-green-100 text-green-800 border-green-200", label: translations.confirmed },
    CANCELLED: { color: "bg-red-100 text-red-800 border-red-200", label: translations.cancelled },
    COMPLETED: { color: "bg-blue-100 text-blue-800 border-blue-200", label: translations.completed },
  };

  const config = statusConfig[status];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card className="border-none shadow-airbnb-md hover:shadow-airbnb-hover transition-all duration-base">
      <CardContent className="p-4">
        {/* Header: Cast Name + Status Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-deep text-base">{castName}</h3>
            <p className="text-xs text-light mt-1">
              {translations.requestedOn} {formatDate(requestedAt)}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`${config.color} text-xs font-semibold px-3 py-1 border whitespace-nowrap`}
          >
            {config.label}
          </Badge>
        </div>

        {/* Details (if confirmed) */}
        {status === "CONFIRMED" && scheduledDate && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">📅</span>
              <span className="text-deep font-medium">{formatDate(scheduledDate)}</span>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">📍</span>
                <span className="text-light">{location}</span>
              </div>
            )}
          </div>
        )}

        {/* Pending message */}
        {status === "PENDING" && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-light/70 italic">
              Awaiting admin coordination...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
