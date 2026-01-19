import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Clock, Code2, Calendar } from "lucide-react";

interface WakaTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data - Replace with actual WakaTime API data
const mockLanguageData = [
  { name: "TypeScript", hours: 45.2, color: "#3178c6" },
  { name: "Python", hours: 32.8, color: "#3776ab" },
  { name: "JavaScript", hours: 28.5, color: "#f7df1e" },
  { name: "Go", hours: 18.3, color: "#00add8" },
  { name: "Rust", hours: 12.1, color: "#ce422b" },
];

const mockDailyData = [
  { day: "Mon", hours: 8.2 },
  { day: "Tue", hours: 9.5 },
  { day: "Wed", hours: 7.8 },
  { day: "Thu", hours: 10.2 },
  { day: "Fri", hours: 8.9 },
  { day: "Sat", hours: 5.3 },
  { day: "Sun", hours: 4.1 },
];

export function WakaTimeModal({ isOpen, onClose }: WakaTimeModalProps) {
  const totalHours = mockLanguageData.reduce((sum, item) => sum + item.hours, 0);
  const avgDaily = mockDailyData.reduce((sum, item) => sum + item.hours, 0) / mockDailyData.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Coding Statistics</DialogTitle>
          <p className="text-muted-foreground mt-1">Last 7 days of activity</p>
        </DialogHeader>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Total Time</span>
            </div>
            <p className="text-2xl font-medium">{totalHours.toFixed(1)}h</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Daily Average</span>
            </div>
            <p className="text-2xl font-medium">{avgDaily.toFixed(1)}h</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Code2 className="w-4 h-4" />
              <span className="text-sm">Languages</span>
            </div>
            <p className="text-2xl font-medium">{mockLanguageData.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Daily Activity Bar Chart */}
          <div>
            <h3 className="text-lg mb-4">Daily Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockDailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="hours" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Language Distribution Pie Chart */}
          <div>
            <h3 className="text-lg mb-4">Languages</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockLanguageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="hours"
                >
                  {mockLanguageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="mt-6">
          <h3 className="text-lg mb-4">Breakdown by Language</h3>
          <div className="space-y-3">
            {mockLanguageData.map((lang) => (
              <div key={lang.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
                <span className="flex-1 text-sm">{lang.name}</span>
                <span className="text-sm text-muted-foreground">{lang.hours}h</span>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(lang.hours / totalHours) * 100}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Integration Note */}
        <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Integration Note:</strong> Replace mock data with WakaTime API calls.
            Get your API key from{" "}
            <a
              href="https://wakatime.com/settings/api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              wakatime.com/settings/api-key
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
