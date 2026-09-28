'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SITE_NAME } from '@/lib/constants';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }

    async function checkAuth() {
      setCheckingAuth(true);
      try {
        // 1. Check live Supabase Auth session
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setIsAdmin(true);
          setCheckingAuth(false);
          return;
        }

        // 2. Not authenticated -> Redirect
        console.log('Unauthenticated access to admin portal. Redirecting to login...');
        router.replace('/admin/login');
      } catch (err) {
        console.error('Error verifying admin authorization:', err);
        router.replace('/admin/login');
      }
    }

    checkAuth();
  }, [pathname, router]);

  const clearLocalAuthSession = () => {
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
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn('Session cleanup failed:', e);
    }
  };

  useEffect(() => {
    // Force reload on pageshow (browser back/forward button cache refresh)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      setTimeout(() => {
        const nextPath = window.location.pathname;
        if (!nextPath.startsWith('/admin')) {
          clearLocalAuthSession();
          supabase.auth.signOut().catch((e) => console.warn('Supabase signout failed:', e));
        }
      }, 50);
    };
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout exception:', e);
    }
    clearLocalAuthSession();
    setIsAdmin(false);
    window.location.href = '/';
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-charcoal animate-spin mb-4" />
        <p className="text-xs font-sans text-muted tracking-wider uppercase">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  // If on login route, render without dashboard chrome layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col font-sans">
      {/* Admin Navbar */}
      <header className="bg-charcoal text-white h-20 px-6 lg:px-12 flex items-center justify-between border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="font-serif text-lg font-bold tracking-wider hover:text-gold transition-colors">
            {SITE_NAME}
          </a>
          <span className="h-5 w-px bg-white/20" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/15 px-2.5 py-1 rounded">
            Admin Console
          </span>
        </div>

        <button
          onClick={handleSignOut}
          className="relative z-50 px-4 py-2 border border-white/20 hover:border-white rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider text-white hover:bg-white hover:text-charcoal transition-all duration-300 shadow-sm cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-16">
        {children}
      </main>
    </div>
  );
}
