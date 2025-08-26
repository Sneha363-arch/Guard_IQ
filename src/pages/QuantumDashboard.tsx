import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Mic, 
  HandIcon, 
  User,
  Globe,
  Lock,
  Cpu,
  BarChart3,
  Brain,
  Leaf,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const QuantumDashboard = () => {
  const { user, hasRequiredBiometrics } = useAuth();
  const [quantumRiskScore, setQuantumRiskScore] = useState(23);
  const [systemHealth, setSystemHealth] = useState(98);
  const [activeThreats, setActiveThreats] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumRiskScore(prev => Math.max(15, Math.min(35, prev + (Math.random() - 0.5) * 4)));
      setSystemHealth(prev => Math.max(95, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (score: number) => {
    if (score < 25) return "text-green-600";
    if (score < 50) return "text-yellow-600";
    if (score < 75) return "text-orange-600";
    return "text-red-600";
  };

  const getRiskLevel = (score: number) => {
    if (score < 25) return "LOW";
    if (score < 50) return "MODERATE";
    if (score < 75) return "HIGH";
    return "CRITICAL";
  };

  // Redirect if not properly authenticated
  if (!user || !hasRequiredBiometrics()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">Please complete all biometric verifications to access the dashboard</p>
            <Button asChild>
              <Link to="/login">Complete Authentication</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-cyan-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="w-12 h-12 text-cyan-500" />
            <div>
              <h1 className="text-3xl font-bold">BioQuantumGate Dashboard</h1>
              <p className="text-muted-foreground">Unified Quantum-Resilient Security Control Center</p>
              <p className="text-sm text-green-600">Welcome, {user.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
            <Button asChild>
              <Link to="/cybersecurity-dashboard">
                <ExternalLink className="w-4 h-4 mr-2" />
                Advanced Cyber Analysis
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Authentication Status */}
        <Card className="border-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-500" />
              <span>Biometric Authentication Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-cyan-50 rounded-lg">
                <Eye className="w-8 h-8 text-cyan-500" />
                <div>
                  <p className="font-semibold">Face Recognition</p>
                  <Badge className={user.biometricData.face ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                    {user.biometricData.face ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Mic className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold">Voice Authentication</p>
                  <Badge className={user.biometricData.voice ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                    {user.biometricData.voice ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <HandIcon className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="font-semibold">Gesture Recognition</p>
                  <Badge className={user.biometricData.gesture ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                    {user.biometricData.gesture ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <Activity className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="font-semibold">Body Pattern</p>
                  <Badge className={user.biometricData.bodyPattern ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                    {user.biometricData.bodyPattern ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quantum Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Quantum Risk Score
                <Zap className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`text-3xl font-bold ${getRiskColor(quantumRiskScore)}`}>
                  {Math.round(quantumRiskScore)}/100
                </div>
                <Badge variant={quantumRiskScore < 25 ? "default" : "destructive"}>
                  {getRiskLevel(quantumRiskScore)} RISK
                </Badge>
                <Progress value={quantumRiskScore} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Your systems are quantum-resistant
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                System Health
                <Activity className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(systemHealth)}%
                </div>
                <Badge className="bg-green-500 text-white">EXCELLENT</Badge>
                <Progress value={systemHealth} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  All biometric systems operational
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Active Threats
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {activeThreats}
                </div>
                <Badge className="bg-green-500 text-white">SECURE</Badge>
                <p className="text-sm text-muted-foreground">
                  No quantum threats detected
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Advanced security tools and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-20 flex-col gap-2">
                <Link to="/cybersecurity-dashboard">
                  <Shield className="w-8 h-8" />
                  <span>Cyber Security Center</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/cybersecurity-dashboard">
                  <Zap className="w-8 h-8" />
                  <span>Quantum Vulnerability Scan</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/cybersecurity-dashboard">
                  <Cpu className="w-8 h-8" />
                  <span>Algorithm Testing</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quantum">Quantum Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Monitoring */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <span>Real-time Monitoring</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Biometric Sessions Active</span>
                      <Badge>1</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quantum Scans Today</span>
                      <Badge>23</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Zero-Knowledge Proofs</span>
                      <Badge className="bg-green-500 text-white">4/4 Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Edge Devices Monitored</span>
                      <Badge>127</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Face authentication completed</span>
                      <span className="text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voice pattern verified</span>
                      <span className="text-muted-foreground">5 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gesture recognition successful</span>
                      <span className="text-muted-foreground">8 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Body pattern analysis complete</span>
                      <span className="text-muted-foreground">11 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantum risk assessment updated</span>
                      <span className="text-muted-foreground">15 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quantum" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Post-Quantum Cryptography */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-indigo-500" />
                    <span>Post-Quantum Cryptography</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>CRYSTALS-Kyber</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SPHINCS+</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dilithium</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>NIST Standards Compliance</span>
                      <Badge className="bg-blue-500 text-white">100%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quantum Threat Simulation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-red-500" />
                    <span>Quantum Threat Simulation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Shor's Algorithm Tests</span>
                      <Badge variant="outline">Passed</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Grover's Algorithm Tests</span>
                      <Badge variant="outline">Passed</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Full Scan</span>
                      <span className="text-sm text-muted-foreground">30 min ago</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      Run New Quantum Simulation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Biometric Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span>Biometric Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Face Recognition Accuracy</span>
                        <span className="text-sm">99.7%</span>
                      </div>
                      <Progress value={99.7} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Voice Verification Accuracy</span>
                        <span className="text-sm">98.9%</span>
                      </div>
                      <Progress value={98.9} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Gesture Recognition Accuracy</span>
                        <span className="text-sm">97.2%</span>
                      </div>
                      <Progress value={97.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Body Pattern Accuracy</span>
                        <span className="text-sm">96.8%</span>
                      </div>
                      <Progress value={96.8} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Threat Intelligence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span>AI Threat Intelligence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>BATS Algorithm Status</span>
                      <Badge className="bg-green-500 text-white">Learning</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Synthetic Data Generation</span>
                      <Badge className="bg-blue-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Anomaly Detection</span>
                      <Badge className="bg-green-500 text-white">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Model Training Sessions</span>
                      <Badge>247 Today</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="research" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Experimental Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-violet-500" />
                    <span>Experimental Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Zero-Knowledge Biometric Proof</span>
                      <Badge className="bg-violet-500 text-white">Beta</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DNA-Driven Key Mutation</span>
                      <Badge variant="outline">Research</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>QuantumTrap Vaults</span>
                      <Badge className="bg-orange-500 text-white">Testing</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Bio-Adaptive Threat Signature</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sustainability Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-green-500" />
                    <span>Green Cryptography</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Energy Efficiency Score</span>
                      <Badge className="bg-green-500 text-white">A+</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Carbon Footprint Reduction</span>
                      <span className="text-green-600 font-semibold">-23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quantum Zero Waste Protocol</span>
                      <Badge className="bg-green-500 text-white">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Green Crypto Score</span>
                      <span className="text-green-600 font-semibold">92/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuantumDashboard;
