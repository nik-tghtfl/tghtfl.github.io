import { MessageSquare, CalendarDays, TrendingUp, Smile } from "lucide-react"

interface StatsCardsProps {
  total: number
  thisWeek: number
  topCategory: string
  sentimentScore: number
  sentimentTrend: number
}

export function StatsCards({ total, thisWeek, topCategory, sentimentScore, sentimentTrend }: StatsCardsProps) {
  const stats = [
    {
      label: "Total",
      value: total.toString(),
      icon: MessageSquare,
      description: "Total feedback"
    },
    {
      label: "This Week",
      value: thisWeek.toString(),
      icon: CalendarDays,
      description: "New entries"
    },
    {
      label: "Top Category",
      value: topCategory,
      icon: TrendingUp,
      description: "Most feedback"
    },
    {
      label: "Sentiment",
      value: `${sentimentScore}%`,
      icon: Smile,
      description: "Positive",
      trend: sentimentTrend
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200 p-6 transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/80 hover:border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <stat.icon className="w-5 h-5 text-blue-600" />
            </div>
            {stat.trend !== undefined && stat.trend !== 0 && (
              <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                stat.trend > 0 
                  ? "bg-orange-100 text-orange-600" 
                  : "bg-red-100 text-red-600"
              }`}>
                {stat.trend > 0 ? "+" : ""}{stat.trend}%
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
