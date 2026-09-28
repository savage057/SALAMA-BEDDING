'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { SITE_NAME } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      localStorage.removeItem('salama-admin-demo-auth');
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.includes('auth-token') ||
            key.includes('salama-admin') ||
            key.includes('supabase.auth') ||
            key.startsWith('sb-') ||
            key.includes('supabase'))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      sessionStorage.clear();
    } catch (e) {
      console.warn('Stale session cleanup failed:', e);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.user) {
        console.log('Successfully authenticated admin user:', data.user.email);
        router.replace('/admin');
      }
    } catch (err: any) {
      console.warn('Authentication failed:', err.message);
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border/40 shadow-xl p-8 lg:p-10 animate-scale-in">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="font-serif text-xs font-bold uppercase tracking-widest text-gold block mb-2">
            Control Panel
          </span>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-charcoal">
            {SITE_NAME} Admin
          </h1>
          <p className="text-xs font-sans text-muted mt-2">
            Secure admin login for stock levels and order fulfillment.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="block text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="admin@salamabeddings.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface/30 rounded-xl border border-border/60 px-4 py-3 text-xs font-sans text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface/30 rounded-xl border border-border/60 px-4 py-3 text-xs font-sans text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-error/10 text-error text-[11px] font-sans leading-normal">
              {errorMsg}
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            className="w-full flex items-center justify-center gap-2 mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
