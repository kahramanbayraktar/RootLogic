import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      toast.success('Login successful');
      navigate(from, { replace: true });
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center gap-6 mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight logo-text">LOGIN</h1>
            <p className="text-sm text-muted-foreground font-ui uppercase tracking-widest">
              Admin Access Required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background/50 border border-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-ui"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/50 border border-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-ui"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Enter Dashboard
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
