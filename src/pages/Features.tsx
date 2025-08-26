
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Camera, Mic, HandIcon, Activity, Brain, Lock, 
  Zap, Globe, Eye, Fingerprint, Wifi, Server, Database 
} from "lucide-react";
import Header from "@/components/Header";

const Features = () => {
  const biometricFeatures = [
    {
      icon: Camera,
      title: "Facial Recognition",
      description: "Advanced AI-powered facial detection with liveness verification and anti-spoofing technology.",
      features: ["Real-time detection", "Liveness verification", "Anti-deepfake protection", "3D facial mapping"],
      color: "cyan"
    },
    {
      icon: Mic,
      title: "Voice Authentication",
      description: "Voiceprint analysis with speech pattern recognition and vocal stress detection.",
      features: ["Voiceprint analysis", "Speech pattern matching", "Stress detection", "Noise cancellation"],
      color: "green"
    },
    {
      icon: HandIcon,
      title: "Gesture Recognition",
      description: "Hand gesture and movement pattern analysis for secure authentication.",
      features: ["Hand tracking", "Gesture sequences", "Movement patterns", "3D pose estimation"],
      color: "purple"
    },
    {
      icon: Activity,
      title: "Body Pattern Analysis",
      description: "AI-powered skeletal pose estimation and gait analysis for unique identification.",
      features: ["Skeletal tracking", "Gait analysis", "Posture recognition", "Movement signature"],
      color: "orange"
    }
  ];

  const quantumFeatures = [
    {
      icon: Lock,
      title: "Post-Quantum Cryptography",
      description: "Implementation of NIST-approved quantum-resistant algorithms.",
      algorithms: ["CRYSTALS-Kyber", "SPHINCS+", "Dilithium", "FALCON"]
    },
    {
      icon: Brain,
      title: "Quantum Attack Simulation",
      description: "Real-time simulation of quantum attacks using Shor's and Grover's algorithms.",
      capabilities: ["Shor's algorithm simulation", "Grover's algorithm testing", "Risk assessment", "Vulnerability analysis"]
    },
    {
      icon: Shield,
      title: "Zero-Knowledge Proofs",
      description: "Verify identity without exposing sensitive biometric data.",
      benefits: ["Privacy preservation", "Data protection", "Secure verification", "Anonymous authentication"]
    },
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "Continuous threat detection and automated response systems.",
      features: ["24/7 monitoring", "Threat intelligence", "Automated response", "Alert systems"]
    }
  ];

  const securityFeatures = [
    {
      icon: Database,
      title: "Secure Data Storage",
      description: "Encrypted biometric template storage with quantum-safe encryption."
    },
    {
      icon: Server,
      title: "Edge Computing",
      description: "Local processing capabilities for enhanced privacy and reduced latency."
    },
    {
      icon: Wifi,
      title: "API Integration",
      description: "RESTful APIs for seamless integration with existing security infrastructure."
    },
    {
      icon: Globe,
      title: "Cross-Platform",
      description: "Compatible with web, mobile, and desktop applications."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-cyan-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Advanced Security <span className="text-cyan-500">Features</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the cutting-edge technologies that make BioQuantumGate the most secure 
            authentication platform for the quantum era.
          </p>
        </div>

        {/* Biometric Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Multi-Modal Biometric Authentication</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {biometricFeatures.map((feature, index) => (
              <Card key={index} className={`border-${feature.color}-200 hover:shadow-lg transition-shadow`}>
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full bg-${feature.color}-100 mr-4`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}-500`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">AI-Powered</Badge>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full bg-${feature.color}-500 mr-2`}></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quantum Security Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Quantum-Resistant Security</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {quantumFeatures.map((feature, index) => (
              <Card key={index} className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <feature.icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">Quantum-Safe</Badge>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(feature.algorithms || feature.capabilities || feature.benefits || feature.features).map((item, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Security Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Enterprise Security</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="text-center border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gray-100">
                      <feature.icon className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Comparison */}
        <Card className="mb-12 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Why Choose BioQuantumGate?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-500 mb-2">Traditional</div>
                <div className="text-sm text-muted-foreground">Single-factor authentication, vulnerable to quantum attacks</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-500 mb-2">Multi-Factor</div>
                <div className="text-sm text-muted-foreground">Multiple factors but not quantum-resistant</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-500 mb-2">BioQuantumGate</div>
                <div className="text-sm text-muted-foreground">Multi-modal biometrics + quantum-resistant security</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 mr-4">
            <Link to="/register">
              Get Started
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Features;
