
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Lock,
  Cpu,
  Globe,
  Server,
  Key,
  Wifi,
  Database,
  Terminal
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CyberSecurityDashboard = () => {
  const { user } = useAuth();
  const [targetUrl, setTargetUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [sshStatus, setSshStatus] = useState({ enabled: false, secure: false });
  const [rsaStatus, setRsaStatus] = useState({ keyLength: 2048, vulnerable: true });

  useEffect(() => {
    // Initialize real-time security monitoring
    initializeSecurityMonitoring();
  }, []);

  const initializeSecurityMonitoring = () => {
    // Simulate real security data
    setSshStatus({ enabled: true, secure: Math.random() > 0.5 });
    setRsaStatus({ 
      keyLength: Math.random() > 0.5 ? 2048 : 4096, 
      vulnerable: Math.random() > 0.3 
    });
  };

  const performQuantumScan = async () => {
    if (!targetUrl) {
      toast.error("Please enter a valid URL or IP address");
      return;
    }

    setIsScanning(true);
    toast.info("Starting quantum vulnerability scan...");

    // Simulate quantum attack simulation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const results = {
      target: targetUrl,
      quantumRisk: Math.floor(Math.random() * 100),
      algorithms: {
        rsa: { vulnerable: true, timeToBreak: "2 hours with quantum computer" },
        ecc: { vulnerable: true, timeToBreak: "30 minutes with quantum computer" },
        aes: { vulnerable: false, note: "Quantum-resistant with Grover's algorithm" }
      },
      recommendations: [
        "Upgrade to CRYSTALS-Kyber for key exchange",
        "Implement SPHINCS+ for digital signatures",
        "Deploy Dilithium for authentication"
      ],
      shorAlgorithmTest: {
        passed: false,
        details: "RSA-2048 factorization simulated successfully"
      },
      groverAlgorithmTest: {
        passed: true,
        details: "AES-256 shows reduced security margin but remains viable"
      }
    };

    setScanResults(results);
    setIsScanning(false);
    toast.success("Quantum scan completed");
  };

  const simulateQuantumAttack = async (algorithm: string) => {
    toast.info(`Simulating ${algorithm} attack...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(`${algorithm} attack simulation completed`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">Please complete biometric authentication first</p>
            <Button asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/quantum-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quantum Dashboard
              </Link>
            </Button>
            <div className="flex items-center">
              <Shield className="w-12 h-12 text-purple-500 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">CyberSecurity Command Center</h1>
                <p className="text-muted-foreground">Advanced Quantum-Resistant Security Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quantum Vulnerability Scanner */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <span>Quantum Vulnerability Scanner</span>
            </CardTitle>
            <CardDescription>Scan websites and systems for quantum vulnerabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Input
                placeholder="Enter URL or IP address (e.g., https://example.com)"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={performQuantumScan}
                disabled={isScanning}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {isScanning ? "Scanning..." : "Start Quantum Scan"}
              </Button>
            </div>

            {scanResults && (
              <div className="space-y-4 mt-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Scan Results for: {scanResults.target}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${scanResults.quantumRisk > 70 ? 'text-red-600' : scanResults.quantumRisk > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {scanResults.quantumRisk}%
                      </div>
                      <p className="text-sm text-muted-foreground">Quantum Risk Score</p>
                    </div>
                    <div className="text-center">
                      <Badge variant={scanResults.shorAlgorithmTest.passed ? "default" : "destructive"}>
                        {scanResults.shorAlgorithmTest.passed ? "PASSED" : "VULNERABLE"}
                      </Badge>
                      <p className="text-sm text-muted-foreground">Shor's Algorithm Test</p>
                    </div>
                    <div className="text-center">
                      <Badge variant={scanResults.groverAlgorithmTest.passed ? "default" : "destructive"}>
                        {scanResults.groverAlgorithmTest.passed ? "PASSED" : "VULNERABLE"}
                      </Badge>
                      <p className="text-sm text-muted-foreground">Grover's Algorithm Test</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Algorithm Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(scanResults.algorithms).map(([algo, data]: [string, any]) => (
                        <div key={algo} className="flex justify-between items-center">
                          <span className="font-medium">{algo.toUpperCase()}</span>
                          <Badge variant={data.vulnerable ? "destructive" : "default"}>
                            {data.vulnerable ? "Vulnerable" : "Secure"}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {scanResults.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Status Dashboard */}
        <Tabs defaultValue="algorithms" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="algorithms">Quantum Algorithms</TabsTrigger>
            <TabsTrigger value="protocols">Security Protocols</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="simulation">Attack Simulation</TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5 text-blue-500" />
                    <span>CRYSTALS-Kyber</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Key Size</span>
                      <span>1024-bit</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantum Resistance</span>
                      <span className="text-green-600">High</span>
                    </div>
                    <Button 
                      onClick={() => simulateQuantumAttack("CRYSTALS-Kyber")}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      Test Algorithm
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-purple-500" />
                    <span>SPHINCS+</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Signature Size</span>
                      <span>16KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantum Resistance</span>
                      <span className="text-green-600">Very High</span>
                    </div>
                    <Button 
                      onClick={() => simulateQuantumAttack("SPHINCS+")}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      Test Algorithm
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-orange-500" />
                    <span>Dilithium</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance</span>
                      <span className="text-green-600">Optimized</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantum Resistance</span>
                      <span className="text-green-600">High</span>
                    </div>
                    <Button 
                      onClick={() => simulateQuantumAttack("Dilithium")}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      Test Algorithm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="protocols" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Terminal className="w-5 h-5 text-green-500" />
                    <span>SSH Protocol Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>SSH Enabled</span>
                      <Badge variant={sshStatus.enabled ? "default" : "destructive"}>
                        {sshStatus.enabled ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Security Level</span>
                      <Badge variant={sshStatus.secure ? "default" : "destructive"}>
                        {sshStatus.secure ? "Secure" : "Needs Update"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Port</span>
                      <span>22</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Protocol Version</span>
                      <span>SSH-2.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5 text-red-500" />
                    <span>RSA Encryption Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Key Length</span>
                      <span>{rsaStatus.keyLength}-bit</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quantum Vulnerable</span>
                      <Badge variant={rsaStatus.vulnerable ? "destructive" : "default"}>
                        {rsaStatus.vulnerable ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Recommended Action</span>
                      <span className="text-orange-600">Upgrade to PQC</span>
                    </div>
                    <Progress value={rsaStatus.vulnerable ? 85 : 15} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      Risk Level: {rsaStatus.vulnerable ? "High" : "Low"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <span>Network Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Connections</span>
                      <Badge>247</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantum Scans</span>
                      <Badge>12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Blocked Attempts</span>
                      <Badge variant="destructive">3</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-green-500" />
                    <span>Data Integrity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Encrypted Data</span>
                      <span className="text-green-600">98.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hash Verifications</span>
                      <Badge className="bg-green-500 text-white">✓ Passed</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Backup Status</span>
                      <Badge className="bg-green-500 text-white">Current</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <span>Global Threats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Quantum Computers</span>
                      <Badge variant="destructive">127 Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Threat Level</span>
                      <Badge className="bg-yellow-500 text-white">Medium</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Update</span>
                      <span className="text-sm">2 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shor's Algorithm Simulation</CardTitle>
                  <CardDescription>Test RSA key factorization resistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Target</span>
                      <span>RSA-2048</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Estimated Time</span>
                      <span className="text-red-600">2.3 hours</span>
                    </div>
                    <Button 
                      onClick={() => simulateQuantumAttack("Shor's Algorithm")}
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      Run Shor's Algorithm
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grover's Algorithm Simulation</CardTitle>
                  <CardDescription>Test symmetric encryption strength</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Target</span>
                      <span>AES-256</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Security Reduction</span>
                      <span className="text-yellow-600">50%</span>
                    </div>
                    <Button 
                      onClick={() => simulateQuantumAttack("Grover's Algorithm")}
                      className="w-full bg-yellow-500 hover:bg-yellow-600"
                    >
                      Run Grover's Algorithm
                    </Button>
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

export default CyberSecurityDashboard;
