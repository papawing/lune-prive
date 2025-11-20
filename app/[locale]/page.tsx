"use client"

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import { Moon, Lock, Sparkles, Globe } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <Navbar />

      {/* Hero Section - Airbnb Style */}
      <div className="min-h-screen w-full bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

          {/* Main Hero Content */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] text-center py-12">

            {/* Hero Title */}
            <div className="space-y-6 mb-12 animate-fade-in-up">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#222222] tracking-tight">
                {t('common.appName')}
              </h1>
              <p className="text-xl md:text-2xl text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
                {t('common.tagline')}
              </p>
            </div>

            {/* CTA Buttons - Airbnb Style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/login">
                <Button variant="airbnb" size="lg" className="min-w-[200px]">
                  {t('auth.login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  {t('auth.register')}
                </Button>
              </Link>
            </div>

            {/* Features Grid - Airbnb Style Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full mb-16">

              {/* Card 1: Exclusive */}
              <div
                className="bg-white relative z-10 rounded-[1rem] p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 animate-fade-in-up"
                tabIndex={0}
                role="button"
                style={{
                  animationDelay: '0ms',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)';
                }}
              >
                <div className="text-[#FF385C] mb-4">
                  <Moon className="w-12 h-12" aria-label="Exclusive matching icon" />
                </div>
                <h3 className="text-xl font-semibold text-[#222222] mb-3">
                  Exclusive Matching
                </h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">
                  Curated connections for discerning members seeking premium experiences
                </p>
              </div>

              {/* Card 2: Privacy */}
              <div
                className="bg-white relative z-10 rounded-[1rem] p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 animate-fade-in-up"
                tabIndex={0}
                role="button"
                style={{
                  animationDelay: '200ms',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)';
                }}
              >
                <div className="text-[#FF385C] mb-4">
                  <Lock className="w-12 h-12" aria-label="Privacy and security icon" />
                </div>
                <h3 className="text-xl font-semibold text-[#222222] mb-3">
                  Private & Secure
                </h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">
                  End-to-end encryption and verified profiles for your peace of mind
                </p>
              </div>

              {/* Card 3: Luxury */}
              <div
                className="bg-white relative z-10 rounded-[1rem] p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 animate-fade-in-up"
                tabIndex={0}
                role="button"
                style={{
                  animationDelay: '400ms',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)';
                }}
              >
                <div className="text-[#FF385C] mb-4">
                  <Sparkles className="w-12 h-12" aria-label="Luxury experience icon" />
                </div>
                <h3 className="text-xl font-semibold text-[#222222] mb-3">
                  Luxury Experience
                </h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">
                  High-class services designed for sophisticated tastes
                </p>
              </div>

            </div>

            {/* Language Support */}
            <div className="flex items-center justify-center gap-4 text-sm text-[#6B6B6B] border-t border-gray-100 pt-8 w-full max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <Globe className="w-6 h-6 text-[#FF385C]" aria-label="Language support icon" />
              <div>
                <p className="font-semibold text-[#222222]">Multilingual Platform</p>
                <p className="text-xs text-[#6B6B6B]">English • 中文 • 日本語</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
