import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Admin credentials
    const correctUsername = 'admin';
    const correctPassword = 'riazopticals108';

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    // Simulate network authentication delay
    setTimeout(() => {
      if (username.trim() === correctUsername && password === correctPassword) {
        onLoginSuccess();
        setUsername('');
        setPassword('');
        setError('');
        onClose();
      } else {
        setError('Invalid username or password. Please try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      {/* Click overlay to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Login Card */}
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 border border-slate-100 animate-scale-up z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-colors"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary mx-auto">
            <Lock size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Admin Authentication</h2>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            Enter your credentials to access the Riaz Sons Opticals inventory management panel.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs flex items-start gap-2.5 mb-4 animate-shake">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
              <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
              <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/55 text-white font-extrabold rounded-xl transition-all shadow-md shadow-primary/20 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>

        </form>



      </div>
    </div>
  );
};
