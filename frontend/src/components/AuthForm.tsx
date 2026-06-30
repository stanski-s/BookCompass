'use client';
import { useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import Link from 'next/link';

export default function AuthForm({ type }: { type: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === 'login') {
        const res = await apiClient.login({ email, password });
        localStorage.setItem('accessToken', res.accessToken);
        window.location.href = '/';
      } else {
        await apiClient.register({ email, password, username });
        window.location.href = '/login';
      }
    } catch (err) {
      alert(`${type === 'login' ? 'Login' : 'Registration'} error`);
    }
  };

  return (
    <main className="flex-grow flex items-stretch min-h-screen bg-background">
      {/* Left Side: Atmospheric Image (Desktop Only) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2Srh331UqYLhZHspyTWb1JGBwfejMACys0X7TRLoN1O_1MdHTCyqzZBPQ-dXIz-hayTqVyJxAyJus7BqjHYBwc5acQpxYroIRbpOJ9FG7c4H-kj9qsFSDdKsoqBCh_Kw-DYJndOEB9OxcZg4zHkXNGu43VjkkgJeRDrdznJtfkGD7lHM-e0D6xVGPGz597d0G3s3B3wqq0zyPAgt7KlsBlf6dI9K4d4IM9khFtgoSjGbXSMxtD9Gd2_1yD6Pfz7UzVFqKFv3BjLQa')",
          }}
        />
        {/* Overlay with Branding */}
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]" />
        <div className="absolute bottom-xl left-xl right-xl text-white">
          <h1 className="font-headline-lg text-headline-lg mb-sm">
            BookCompass
          </h1>
          <p className="font-body-lg text-body-lg opacity-90 max-w-md">
            Navigate your literary journey with clarity and focus.
          </p>
        </div>
      </div>

      {/* Right Side: Authentication Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-lg md:p-xxl bg-surface pt-xxl lg:pt-0">
        <div className="w-full max-w-md">
          {/* Branding for Mobile */}
          <div className="lg:hidden mb-xl text-center">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
              BookCompass
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-surface-container-lowest p-lg md:p-xl rounded-lg shadow-xl border border-outline-variant/30">
            {/* Tabs */}
            <div className="flex gap-lg border-b border-outline-variant mb-xl">
              <Link
                href="/login"
                className={`pb-sm font-label-md text-label-md border-b-2 transition-all duration-200 ${type === 'login' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`pb-sm font-label-md text-label-md border-b-2 transition-all duration-200 ${type === 'register' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
              >
                Sign Up
              </Link>
            </div>

            {/* Form */}
            <div>
              <header className="mb-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  {type === 'login' ? 'Welcome' : 'Begin Your Journey'}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {type === 'login'
                    ? 'Enter your credentials to access your library.'
                    : 'Join a community of curious readers.'}
                </p>
              </header>

              <form className="space-y-md" onSubmit={handleSubmit}>
                {type === 'register' && (
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">
                      Full Name / Username
                    </label>
                    <input
                      className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                      placeholder="John Doe"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">
                    Email Address
                  </label>
                  <input
                    className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-xs">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant">
                      Password
                    </label>
                    {type === 'login' && (
                      <a
                        className="font-label-sm text-label-sm text-primary hover:underline"
                        href="#"
                      >
                        Forgot Password?
                      </a>
                    )}
                  </div>
                  <input
                    className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {type === 'register' && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                    By creating an account, you agree to our{' '}
                    <a className="text-primary underline" href="#">
                      Terms of Service
                    </a>
                    .
                  </p>
                )}

                <button
                  className="w-full py-md bg-primary text-on-primary font-label-md text-label-md rounded-lg active:scale-[0.98] transition-transform hover:bg-primary-container hover:shadow-lg mt-sm"
                  type="submit"
                >
                  {type === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            </div>

            {/* Footer Links */}
            <div className="mt-xl text-center space-x-md">
              <a
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                About BookCompass
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
