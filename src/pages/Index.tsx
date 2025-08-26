
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Mic, HandIcon, Activity, Cpu, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import HomeChatbot from "@/components/HomeChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-cyan-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-cyan-500 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
              BioQuantumGate
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience the future of authentication with quantum-safe biometric security. 
            Face, Voice, Gesture, and Body Pattern recognition powered by AI.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/learning-lab">🚀 Try Learning Lab</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/vip-monitoring">🔍 VIP Monitor</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          <Card className="border-cyan-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Eye className="w-8 h-8 text-cyan-500 mb-2" />
              <CardTitle className="text-lg">Face Recognition</CardTitle>
              <CardDescription>
                Advanced facial authentication using AI-powered feature detection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mic className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle className="text-lg">Voice Authentication</CardTitle>
              <CardDescription>
                Unique vocal pattern recognition with noise cancellation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <HandIcon className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle className="text-lg">Gesture Control</CardTitle>
              <CardDescription>
                Hand gesture and pose recognition for intuitive interaction
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Activity className="w-8 h-8 text-orange-500 mb-2" />
              <CardTitle className="text-lg">Body Patterns</CardTitle>
              <CardDescription>
                Gait analysis and posture recognition for enhanced security
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Quantum Security Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Quantum-Safe Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200">
              <CardHeader>
                <Cpu className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <CardTitle>Quantum AI</CardTitle>
                <CardDescription>
                  Advanced quantum computing principles for unbreakable encryption
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <CardTitle>Zero Trust</CardTitle>
                <CardDescription>
                  Multi-layered security with continuous verification
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader>
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <CardTitle>Real-time Processing</CardTitle>
                <CardDescription>
                  Lightning-fast authentication with AI optimization
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Card className="border-gradient bg-gradient-to-r from-cyan-50 to-purple-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Experience the Future?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who trust BioQuantumGate for their digital security needs.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                  <Link to="/register">Start Your Journey</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/features">Explore Features</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add the Home Chatbot */}
      <HomeChatbot />
    </div>
  );
};

export default Index;
