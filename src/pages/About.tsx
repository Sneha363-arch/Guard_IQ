
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Brain, Lock, Zap } from "lucide-react";
import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-cyan-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-cyan-500 mr-4" />
            <h1 className="text-4xl font-bold">
              Bio<span className="text-cyan-500">Quantum</span>Gate
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The world's first unified quantum-resilient biometric firewall, combining advanced 
            biometric authentication with post-quantum cryptographic security.
          </p>
          <div className="flex justify-center space-x-2 mt-6">
            <Badge variant="secondary">Quantum-Resistant</Badge>
            <Badge variant="secondary">AI-Powered</Badge>
            <Badge variant="secondary">Zero-Trust Architecture</Badge>
          </div>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 border-cyan-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 mr-2 text-cyan-500" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-center max-w-4xl mx-auto">
              To eliminate dependency on external security tools by embedding AI-driven biometric authentication, 
              post-quantum cryptographic defenses, autonomous quantum attack mitigation, and self-evolving 
              threat intelligence into a single, unified platform.
            </p>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-green-500" />
                Frontend Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Vite</span>
                  <Badge variant="outline">Build Tool</Badge>
                </div>
                <div className="flex justify-between">
                  <span>React + TypeScript</span>
                  <Badge variant="outline">UI Framework</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tailwind CSS</span>
                  <Badge variant="outline">Styling</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Shadcn/UI</span>
                  <Badge variant="outline">Components</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-orange-500" />
                Security Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>CRYSTALS-Kyber</span>
                  <Badge variant="outline">PQC KEM</Badge>
                </div>
                <div className="flex justify-between">
                  <span>SPHINCS+</span>
                  <Badge variant="outline">Digital Signatures</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Dilithium</span>
                  <Badge variant="outline">Lattice Crypto</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Zero-Knowledge Proofs</span>
                  <Badge variant="outline">Privacy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Revolutionary Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg">Multi-Modal Biometrics</CardTitle>
                <CardDescription>
                  Advanced facial, voice, gesture, and body pattern recognition
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Quantum Attack Simulation</CardTitle>
                <CardDescription>
                  Real-time Shor's and Grover's algorithm attack simulations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">Zero-Knowledge Authentication</CardTitle>
                <CardDescription>
                  Verify identity without exposing biometric data
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-500">99.9%</div>
            <div className="text-sm text-muted-foreground">Authentication Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">&lt; 2s</div>
            <div className="text-sm text-muted-foreground">Verification Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500">4</div>
            <div className="text-sm text-muted-foreground">Biometric Modalities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">Quantum</div>
            <div className="text-sm text-muted-foreground">Resistant</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600">
            <Link to="/register">
              Experience the Future of Security
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
