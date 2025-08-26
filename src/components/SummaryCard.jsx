import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SummaryCard({ icon, title, value, subtitle }) {
  return (
    <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-slate-200">
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-slate-100 mb-1">{value}</p>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
