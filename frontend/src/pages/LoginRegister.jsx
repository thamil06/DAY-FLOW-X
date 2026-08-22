import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

const LoginRegister = ({ defaultMode = 'login' }) => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setIsLogin(defaultMode === 'login');
    setErrorMsg('');
    setSuccessMsg('');
  }, [defaultMode]);

  // If user is already logged in, redirect them to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const { name, email, password, confirmPassword } = formData;

    if (!email || !password) {
      setErrorMsg('Email and password are required');
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!name) {
        setErrorMsg('Name is required');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await login(email, password);
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        await register(name, email, password);
        setSuccessMsg('Account registered successfully!');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2.5 mb-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white font-extrabold tracking-wider text-sm shadow-md">DFX</div>
            <span className="font-black text-slate-900 tracking-wide text-xl">DAY-FLOW-X</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
            {isLogin ? 'Sign in to your dashboard' : 'Create your productivity account'}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-2">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-bold"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 mb-6 flex items-start space-x-3 text-sm font-medium">
            <ShieldAlert size={18} className="flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 mb-6 flex items-start space-x-3 text-sm font-medium">
            <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-medium outline-none transition-all"
                placeholder="Full Name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-medium outline-none transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-medium outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-medium outline-none transition-all"
                placeholder="••••••••"
                required={!isLogin}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors">
            ← Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
