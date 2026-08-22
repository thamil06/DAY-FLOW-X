import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Timer, 
  BarChart2, 
  Target, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';

const Navbar = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Daily Planner', path: '/planner', icon: Calendar },
    { name: 'Focus Mode', path: '/focus', icon: Timer },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const activeItem = navItems.find(item => location.pathname === item.path);
    return activeItem ? activeItem.name : 'DAY-FLOW-X';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="bg-slate-900 text-white flex justify-between items-center px-4 py-3 md:hidden sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white font-black tracking-wider text-sm">DFX</div>
          <span className="font-bold tracking-tight text-lg text-white">DAY-FLOW-X</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`bg-slate-900 text-slate-300 w-full md:w-64 flex flex-col fixed md:sticky top-0 h-[calc(100vh-52px)] md:h-screen z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Logo Section */}
        <div className="p-6 hidden md:flex items-center space-x-3 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-xl text-white font-extrabold tracking-wider text-base shadow-lg shadow-indigo-600/30">DFX</div>
          <span className="font-black text-white tracking-wide text-xl">DAY-FLOW-X</span>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/40">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User Profile'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        {/* Desktop Top Header Bar */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 hidden md:flex justify-between items-center sticky top-0 z-30">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{getPageTitle()}</h1>
          <div className="text-sm text-slate-500 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Navbar;
