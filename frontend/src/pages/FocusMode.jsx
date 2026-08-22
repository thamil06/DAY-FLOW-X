import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  CheckCircle,
  Loader,
  HelpCircle
} from 'lucide-react';

const FocusMode = () => {
  const [mode, setMode] = useState('focus'); // focus, break
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min in sec
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [savingLog, setSavingLog] = useState(false);
  const [notification, setNotification] = useState('');

  const timerRef = useRef(null);

  // Mode configurations
  const focusTime = 25 * 60;
  const breakTime = 5 * 60;

  useEffect(() => {
    // Fetch user's summary initially to pre-load total focus minutes & completed sessions
    const fetchInitialFocus = async () => {
      try {
        const data = await api.analytics.getSummary();
        setTotalFocusMinutes(Math.round(data.focusHours * 60));
        setCompletedSessions(data.completedTasks); // fallback indicator
      } catch (err) {
        console.error('Focus summary load error:', err);
      }
    };
    fetchInitialFocus();
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, mode]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    clearInterval(timerRef.current);

    if (mode === 'focus') {
      const minutesLogged = 25;
      setSavingLog(true);
      try {
        await api.analytics.logFocus(minutesLogged);
        setTotalFocusMinutes((prev) => prev + minutesLogged);
        setCompletedSessions((prev) => prev + 1);
        setNotification('Awesome job! 25-minute focus session recorded successfully.');
      } catch (err) {
        console.error('Error logging focus minutes:', err);
        setNotification('Focus session complete, but failed to save to cloud.');
      } finally {
        setSavingLog(false);
      }

      // Play beep if possible
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440Hz A4
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        console.warn('Audio API not allowed/supported until user interacts');
      }

      // Switch to break
      setMode('break');
      setTimeLeft(breakTime);
    } else {
      setNotification('Break is over! Ready to focus?');
      setMode('focus');
      setTimeLeft(focusTime);
    }
  };

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);

  const handleReset = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    setTimeLeft(mode === 'focus' ? focusTime : breakTime);
  };

  const toggleMode = (newMode) => {
    setIsActive(false);
    clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? focusTime : breakTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getPercentProgress = () => {
    const total = mode === 'focus' ? focusTime : breakTime;
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      {/* Alert Notifications */}
      {notification && (
        <div className="bg-emerald-50 text-emerald-800 p-4.5 rounded-2xl border border-emerald-100 flex items-start justify-between gap-3 text-sm font-semibold">
          <div className="flex items-center space-x-2.5">
            <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-emerald-500 hover:text-emerald-800 font-bold">×</button>
        </div>
      )}

      {/* Timer Board */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center relative overflow-hidden flex flex-col items-center">
        {/* Mode Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
          <button
            onClick={() => toggleMode('focus')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'focus' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Brain size={14} />
            <span>Focus Session (25m)</span>
          </button>
          <button
            onClick={() => toggleMode('break')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'break' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Coffee size={14} />
            <span>Short Break (5m)</span>
          </button>
        </div>

        {/* Circular Timing Graphic */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          {/* Progress Ring */}
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="116"
              stroke="#f1f5f9"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="116"
              stroke={mode === 'focus' ? '#4f46e5' : '#10b981'}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 116}
              strokeDashoffset={2 * Math.PI * 116 * (1 - getPercentProgress() / 100)}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          
          <div className="z-10">
            <p className="text-5xl font-black text-slate-900 tracking-tighter">{formatTime(timeLeft)}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {isActive ? 'FLOW RUNNING' : 'TIMER PAUSED'}
            </p>
          </div>
        </div>

        {/* Control Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleReset}
            className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors shadow-sm"
            title="Reset Timer"
          >
            <RotateCcw size={20} />
          </button>

          {isActive ? (
            <button
              onClick={handlePause}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Pause size={20} />
              <span>Pause Focus</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Play size={20} />
              <span>Start Session</span>
            </button>
          )}

          <div className="p-4 text-transparent w-12"></div>
        </div>
      </div>

      {/* Focus Analytics Widget */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md">
        <h3 className="text-base font-extrabold text-white mb-4">Focus Record Stats</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-950/40 p-4.5 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Focus Sessions Done</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-black text-indigo-400">{completedSessions}</span>
              <span className="text-xs text-slate-500 font-bold">sessions today</span>
            </div>
          </div>

          <div className="bg-slate-950/40 p-4.5 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Focus Time</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-black text-indigo-400">{totalFocusMinutes}</span>
              <span className="text-xs text-slate-500 font-bold">minutes today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
