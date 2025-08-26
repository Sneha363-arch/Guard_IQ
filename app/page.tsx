"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Activity, Database, Users, Lock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function GuardIQDashboard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <div
        className="fixed pointer-events-none z-50 w-6 h-6 bg-cyan-400/30 rounded-full blur-sm transition-all duration-75 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
      />
      <div
        className="fixed pointer-events-none z-50 w-3 h-3 bg-cyan-400/60 rounded-full transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 6,
          top: mousePosition.y - 6,
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="relative flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <Shield className="h-8 w-8 text-blue-400 group-hover:text-cyan-400 transition-colors duration-300" />
                <Eye className="h-4 w-4 text-cyan-400 absolute group-hover:text-blue-400 transition-colors duration-300" />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                GuardIQ
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#about"
                className="text-slate-300 hover:text-cyan-400 transition-all duration-300 relative group"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#features"
                className="text-slate-300 hover:text-cyan-400 transition-all duration-300 relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#contact"
                className="text-slate-300 hover:text-cyan-400 transition-all duration-300 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse group-hover:bg-cyan-500/30 transition-all duration-500"></div>
              <div className="relative bg-slate-800/50 p-8 rounded-full border border-blue-500/30 group-hover:border-cyan-500/50 group-hover:scale-110 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/25">
                <div className="relative flex items-center justify-center">
                  <Shield className="h-16 w-16 text-blue-400 group-hover:text-cyan-400 transition-colors duration-300" />
                  <Eye className="h-8 w-8 text-cyan-400 absolute group-hover:text-blue-400 transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300 cursor-default">
            Guard<span className="text-blue-400 hover:text-cyan-400 transition-colors duration-300">IQ</span>
          </h1>

          <p className="text-2xl md:text-3xl text-blue-300 mb-6 font-semibold hover:text-cyan-300 transition-colors duration-300 cursor-default">
            VIP Digital Identity Protection
          </p>

          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A quantum-safe monitoring platform to protect celebrities, politicians, and executives from impersonation,
            misinformation, and deepfakes.
          </p>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 max-w-2xl mx-auto hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-300 hover:scale-105">
            <p className="text-amber-300 font-medium">
              ⚠️ This platform is strictly designed for VIPs and not for public use.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 hover:text-cyan-400 transition-colors duration-300 cursor-default">
              About GuardIQ
            </h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/50 hover:border-cyan-500/30 hover:scale-105 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10">
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                GuardIQ is an advanced digital identity protection platform specifically designed for high-profile
                individuals who face unique cybersecurity challenges. Our quantum-safe technology monitors the digital
                landscape 24/7, detecting impersonation attempts, misinformation campaigns, and sophisticated deepfake
                attacks before they can damage your reputation or compromise your security.
              </p>
              <p className="text-blue-300 font-semibold">
                Proudly developed by Team TriNova - pioneering the future of VIP cybersecurity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 hover:text-cyan-400 transition-colors duration-300 cursor-default">
            Advanced Security Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-red-500/50 hover:bg-slate-800/70 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-red-500/20 group cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-red-500/10 rounded-full w-fit group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300">
                  <Activity className="h-8 w-8 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                </div>
                <CardTitle className="text-white group-hover:text-red-300 transition-colors duration-300">
                  Threat Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300 text-center group-hover:text-slate-200 transition-colors duration-300">
                  AI-powered monitoring for impersonation and deepfake threats
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-green-500/50 hover:bg-slate-800/70 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-green-500/20 group cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-500/10 rounded-full w-fit group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                  <Eye className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                </div>
                <CardTitle className="text-white group-hover:text-green-300 transition-colors duration-300">
                  Real-Time Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300 text-center group-hover:text-slate-200 transition-colors duration-300">
                  Live monitoring dashboard with instant threat notifications
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/70 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/20 group cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-500/10 rounded-full w-fit group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
                  <Users className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                </div>
                <CardTitle className="text-white group-hover:text-purple-300 transition-colors duration-300">
                  VIP Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300 text-center group-hover:text-slate-200 transition-colors duration-300">
                  Exclusive access control and personalized security profiles
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/70 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/20 group cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-cyan-500/10 rounded-full w-fit group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300">
                  <Lock className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                </div>
                <CardTitle className="text-white group-hover:text-cyan-300 transition-colors duration-300">
                  Quantum Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300 text-center group-hover:text-slate-200 transition-colors duration-300">
                  Post-quantum cryptography for future-proof protection
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Access VIP Services Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 hover:text-cyan-400 transition-colors duration-300 cursor-default">
            Access VIP Services
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/verify" className="group">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-2xl text-center hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-cyan-500/40 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Shield className="h-16 w-16 text-white mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Verify VIP</h3>
                <p className="text-cyan-100 mb-6 leading-relaxed relative z-10">
                  Authenticate your VIP status and access exclusive protection services
                </p>
                <div className="flex items-center justify-center text-white font-semibold group-hover:translate-x-2 transition-all duration-300 relative z-10">
                  Get Started
                  <svg
                    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/vault" className="group">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-2xl text-center hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-purple-500/40 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Database className="h-16 w-16 text-white mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">VIP Data Vault</h3>
                <p className="text-purple-100 mb-6 leading-relaxed relative z-10">
                  Access your secure data vault and monitoring dashboard
                </p>
                <div className="flex items-center justify-center text-white font-semibold group-hover:translate-x-2 transition-all duration-300 relative z-10">
                  Enter Vault
                  <svg
                    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm py-12 px-4 relative z-10"
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link
                  href="#contact"
                  className="block text-slate-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Contact
                </Link>
                <Link href="#" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">
                  LinkedIn (TriNova)
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Built by Team TriNova</h3>
              <p className="text-slate-400">Advanced cybersecurity solutions for VIP protection</p>
            </div>
          </div>

          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
            <p className="text-slate-500">© 2025 GuardIQ. Quantum-safe VIP protection platform.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
