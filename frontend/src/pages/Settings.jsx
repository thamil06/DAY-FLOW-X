import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Settings as SettingsIcon, 
  Info, 
  Database, 
  Terminal 
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 font-sans max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-500 font-medium">Manage your personal profile and inspect server settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-50">
          <User size={20} className="text-indigo-600" />
          <h3 className="text-base font-black text-slate-950">Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-2xl text-slate-900 text-sm font-semibold">
              {user?.name || 'Loading...'}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-2xl text-slate-900 text-sm font-semibold">
              {user?.email || 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* System Diagnostics */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <Terminal size={20} className="text-indigo-400" />
          <h3 className="text-base font-extrabold text-white">Diagnostics & Connection</h3>
        </div>

        <div className="space-y-3.5 text-xs font-semibold text-slate-400">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
            <span>API Server Endpoint:</span>
            <span className="font-mono text-indigo-400 bg-slate-950 px-2 py-0.5 rounded">
              {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
            <span>Local Database Type:</span>
            <span className="font-mono text-indigo-400 bg-slate-950 px-2 py-0.5 rounded">SQLite File</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
            <span>ORM Layer:</span>
            <span className="font-mono text-indigo-400 bg-slate-950 px-2 py-0.5 rounded">Prisma Client</span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span>Platform Build:</span>
            <span className="font-mono text-indigo-400 bg-slate-950 px-2 py-0.5 rounded">V2.0.0-Stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
