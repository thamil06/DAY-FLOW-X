import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Calendar, 
  Timer, 
  BarChart2, 
  Target, 
  Bell, 
  Zap, 
  Shield, 
  Users 
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col font-sans">
      {/* Header / Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white font-extrabold tracking-wider text-base shadow-md shadow-indigo-600/20">DFX</div>
          <span className="font-black text-slate-900 tracking-wide text-2xl">DAY-FLOW-X</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors">Sign In</Link>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 md:py-24 text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6 text-indigo-700 text-sm font-semibold shadow-sm">
          <Zap size={14} className="animate-pulse" />
          <span>V2.0: Now with Intelligent Analytics & Streaks</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Intelligently Flow Through Your Day with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">DAY-FLOW-X</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mt-6 max-w-2xl mx-auto font-medium">
          A full-stack, intelligent productivity platform designed to align your tasks, schedule your time blocks, trace focus metrics, and visualize analytics in one seamless workflow.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/register" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 text-base transition-all">
            Start Planning Free
          </Link>
          <a href="#features" className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-2xl text-base transition-all shadow-sm">
            Learn More
          </a>
        </div>

        {/* Dashboard Preview mockup */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xl shadow-slate-200 max-w-5xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-400"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-400"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-green-400"></span>
            </div>
            <div className="bg-slate-100 rounded-md text-xs text-slate-400 px-10 py-1 font-mono">http://localhost:5173/dashboard</div>
            <div className="w-10"></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-left p-2">
            <div className="col-span-3 md:col-span-1 bg-slate-900 text-white rounded-xl p-5 flex flex-col space-y-4">
              <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase">DFX CORE PLATFORM</span>
              <h3 className="text-lg font-bold text-white leading-snug">Continuous streak scoring algorithm and task analytics.</h3>
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Server API connection</span>
                <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">ONLINE</span>
              </div>
            </div>
            <div className="col-span-3 md:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-200/40">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-900 text-sm">Dashboard Overview</span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Daily Progress: 80%</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">Intelligent Streak</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">7 Days</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">Focus Hours Today</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">2.5 Hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-slate-200/60">
        <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight text-slate-900">
          Everything You Need to Master Your Flow
        </h2>
        <p className="text-center text-slate-600 font-medium mt-3 max-w-xl mx-auto">
          Combining all productivity utilities into a single, unified database and workflow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Card 1: Tasks */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <CheckSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Task Management</h3>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              Create, tag, prioritize, and structure tasks. Easily organize workflow via List or Kanban boards.
            </p>
          </div>

          {/* Card 2: Daily Planner */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Daily Time Planner</h3>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              Map your day hour-by-hour. Block timing slots for chores, projects, focus hours, and wellness.
            </p>
          </div>

          {/* Card 3: Focus Timer */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Timer size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Pomodoro Focus Timer</h3>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              Run custom session lengths. When complete, focus minutes automatically sync with database analytics.
            </p>
          </div>

          {/* Card 4: Analytics */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <BarChart2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Intelligent Analytics</h3>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              Gain clarity via Recharts curves tracking completed tasks, category statistics, and productivity trends.
            </p>
          </div>

          {/* Card 5: Personal Goals */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Personal Goals Tracking</h3>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              Set milestones, trace numeric objectives, map target deadlines, and check visual progress meters.
            </p>
          </div>

          {/* Card 6: Notifications */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Bell size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Notification Center</h3>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              Receive live feedback on task timings, focus achievements, streaks, and upcoming deadlines.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-4xl font-extrabold text-indigo-400">100%</h4>
            <p className="text-slate-400 mt-2 text-sm font-semibold">Local SQLite Database Sync</p>
          </div>
          <div>
            <h4 className="text-4xl font-extrabold text-indigo-400">25+ min</h4>
            <p className="text-slate-400 mt-2 text-sm font-semibold">Default Pomodoro Cycles</p>
          </div>
          <div>
            <h4 className="text-4xl font-extrabold text-indigo-400">0.0 ms</h4>
            <p className="text-slate-400 mt-2 text-sm font-semibold">Restoration Lag with Web JWTs</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} DAY-FLOW-X Platform. Open Source under MIT license.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 font-medium">
            <a href="https://github.com/thamil06/DAY-FLOW-X" className="hover:text-slate-800">GitHub Repository</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
