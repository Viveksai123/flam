'use client';

import React, { useState } from 'react';
import {
  Pencil,
  Zap,
  Users,
  Share2,
  ArrowRight,
  Check,
  Github,
  Twitter,
} from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: Pencil,
      title: 'Advanced Drawing Tools',
      description:
        'Pencil, eraser, shapes, and more with full color customization',
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'See others drawing in real-time with sub-100ms latency',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: '60+ FPS smooth drawing with optimized rendering',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share room ID instantly to collaborate with anyone',
    },
  ];

  const benefits = [
    'Unlimited canvases and collaborators',
    'Automatic cloud saves every 5 seconds',
    'Export drawings as JSON',
    'Undo/redo with full history',
    'Performance monitoring',
    'Mobile touch support',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Pencil size={20} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DrawSync</span>
          </div>
          <button
            onClick={onStart}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/50 border border-border rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Now in Beta - Join the community
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
              Real-time Collaborative{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Drawing Canvas
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Draw together with anyone, anywhere. Instant synchronization,
              beautiful UI, and powerful tools for creative collaboration.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={onStart}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              Start Drawing Now
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-muted transition-all">
              View Docs
            </button>
          </div>

          {/* Trust Badge */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by creative teams
            </p>
            <div className="flex items-center justify-center gap-6 text-muted-foreground">
              {['Figma', 'Sketch', 'Adobe', 'Canva'].map((brand) => (
                <span key={brand} className="text-sm font-medium">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for seamless collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-6 hover:border-accent transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-all mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why DrawSync?
            </h2>
            <p className="text-lg text-muted-foreground">
              Built for modern creative teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:border-accent transition-all"
              >
                <Check size={20} className="text-green-500 flex-shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-8">
            Get notified about new features and updates
          </p>

          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pencil size={20} className="text-primary" />
                <span className="font-bold text-foreground">DrawSync</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time collaborative drawing for everyone
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Security', 'Roadmap'],
              },
              {
                title: 'Resources',
                links: ['Documentation', 'API', 'Blog', 'Community'],
              },
              {
                title: 'Company',
                links: ['About', 'Contact', 'Privacy', 'Terms'],
              },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold text-foreground mb-3">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-all"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 DrawSync. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 hover:bg-secondary rounded-lg transition-all"
              >
                <Github size={18} className="text-muted-foreground" />
              </a>
              <a
                href="#"
                className="p-2 hover:bg-secondary rounded-lg transition-all"
              >
                <Twitter size={18} className="text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
