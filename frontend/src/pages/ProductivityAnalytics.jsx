import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart2, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Zap,
  Loader
} from 'lucide-react';

const ProductivityAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [summaryRes, weeklyRes, categoryRes] = await Promise.all([
          api.analytics.getSummary(),
          api.analytics.getWeekly(),
          api.analytics.getCategories()
        ]);
        
        setSummary(summaryRes);
        setWeeklyData(weeklyRes);
        setCategoryData(categoryRes.filter(cat => cat.value > 0)); // only show categories with tasks
      } catch (err) {
        console.error('Error fetching analytics reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const COLORS = ['#4f46e5', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#64748b'];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600">
            <CheckSquare size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completion Rate</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{summary?.completionPercentage || 0}%</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-violet-50 text-violet-600">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Focus Time logged</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{summary?.focusHours || 0} Hrs</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-orange-50 text-orange-600">
            <Zap size={22} className="fill-orange-600/10" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Productivity Score</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{summary?.productivityScore || 0}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completed Tasks</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{summary?.completedTasks || 0} Tasks</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Weekly completed tasks */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-950">Weekly Completion Trend</h3>
            <p className="text-xs text-slate-400 font-medium">Tasks completed over the last 7 days</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }} 
                  activeDot={{ r: 6 }}
                  name="Completed Tasks"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#cbd5e1" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4"
                  dot={false}
                  name="Total Tasks Scheduled"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Category Distribution */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-950">Category breakdown</h3>
            <p className="text-xs text-slate-400 font-medium">Distribution of tasks across categories</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {categoryData.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                No tasks available for category distribution.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          
          {/* Legend Table */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-extrabold text-slate-500 uppercase">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="truncate">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityAnalytics;
