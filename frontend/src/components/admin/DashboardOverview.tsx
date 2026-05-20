import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useDashboardOverview } from "../../Hook/useDashboardOverview";

const COLORS = ["#D4AF37", "#8B5A2B", "#F5F5DC", "#4A4A4A"];

export default function DashboardOverview() {
  const { loading, stats, revenueData, reservationData, typeData } = useDashboardOverview();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gold">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gold/5 rounded-full group-hover:bg-gold/10 transition-colors blur-2xl"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-gold">
                  <Icon size={22} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                  {stat.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-cream/60 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-serif font-bold text-cream mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
          <h3 className="text-lg font-serif font-bold text-gold mb-6">Tăng trưởng doanh thu (Ước tính)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000000}tr`} />
                <Tooltip 
                  formatter={(value: number) => [new Intl.NumberFormat("vi-VN").format(value) + " đ", "Doanh thu"]}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4, fill: '#1a1a1a', stroke: '#D4AF37', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#D4AF37' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Bar Chart */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg">
          <h3 className="text-lg font-serif font-bold text-gold mb-6">Đặt bàn theo ngày trong tuần</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reservationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="bookings" fill="#8B5A2B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Types Pie Chart */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-lg lg:col-span-2">
          <h3 className="text-lg font-serif font-bold text-gold mb-6">Cơ cấu loại hình đặt bàn</h3>
          <div className="h-72 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%" maxHeight={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '8px', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
