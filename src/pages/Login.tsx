
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, User, Scan, Mic, HandIcon, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter both username and password");
      return;
    }

    const loginSuccess = loginUser(credentials.username, credentials.password);
    
    if (loginSuccess) {
      toast.success("Credentials verified! Proceeding to biometric authentication...");
      // Navigate to first biometric verification
      navigate("/face-auth");
    } else {
      toast.error("Invalid credentials. Please check your username and password.");
    }
  };

  const handleBiometricLogin = (type: string) => {
    console.log(`Starting ${type} authentication`);
    switch(type) {
      case 'face':
        navigate("/face-auth");
        break;
      case 'voice':
        navigate("/voice-auth");
        break;
      case 'gesture':
        navigate("/gesture-auth");
        break;
      case 'body':
        navigate("/body-auth");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button asChild variant="ghost" size="sm" className="mr-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-cyan-500 mr-2" />
            <span className="text-xl font-bold">BioQuantumGate</span>
          </div>
        </div>

        <Card className="border-cyan-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Secure Login</CardTitle>
            <CardDescription>Multi-factor biometric authentication for maximum security</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credentials" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Credentials
                </TabsTrigger>
                <TabsTrigger value="biometric" className="flex items-center gap-2">
                  <Scan className="w-4 h-4" />
                  Biometric
                </TabsTrigger>
              </TabsList>

              <TabsContent value="credentials" className="space-y-4">
                <form onSubmit={handleCredentialLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={credentials.username}
                      onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                    Continue to Biometric Authentication
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="biometric" className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Choose your preferred biometric authentication method:
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-cyan-200 hover:bg-cyan-50"
                    onClick={() => handleBiometricLogin('face')}
                  >
                    <Scan className="w-6 h-6 text-cyan-500" />
                    <span className="text-sm">Face Recognition</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-green-200 hover:bg-green-50"
                    onClick={() => handleBiometricLogin('voice')}
                  >
                    <Mic className="w-6 h-6 text-green-500" />
                    <span className="text-sm">Voice Authentication</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-purple-200 hover:bg-purple-50"
                    onClick={() => handleBiometricLogin('gesture')}
                  >
                    <HandIcon className="w-6 h-6 text-purple-500" />
                    <span className="text-sm">Gesture Recognition</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-orange-200 hover:bg-orange-50"
                    onClick={() => handleBiometricLogin('body')}
                  >
                    <Activity className="w-6 h-6 text-orange-500" />
                    <span className="text-sm">Body Pattern</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-cyan-500 hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
