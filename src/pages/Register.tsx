
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Shield, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    faceAuth: true,
    voiceAuth: true,
    gestureAuth: true,
    bodyPatternAuth: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Registration form submitted:', formData);
    
    // Validation
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Count selected authentication methods
    const selectedMethods = [
      formData.faceAuth,
      formData.voiceAuth,
      formData.gestureAuth,
      formData.bodyPatternAuth
    ].filter(Boolean).length;

    console.log('Selected authentication methods:', selectedMethods);

    if (selectedMethods < 3) {
      toast.error("Please select at least 3 authentication methods for enhanced security");
      return;
    }

    // Register the user
    registerUser({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    toast.success("Registration successful! Please complete biometric setup.");
    
    // Navigate to first selected biometric setup
    if (formData.faceAuth) {
      navigate("/face-auth");
    } else if (formData.voiceAuth) {
      navigate("/voice-auth");
    } else if (formData.gestureAuth) {
      navigate("/gesture-auth");
    } else if (formData.bodyPatternAuth) {
      navigate("/body-auth");
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
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Register for secure biometric authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <User className="w-4 h-4" />
                  <span>Basic Information</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <Shield className="w-4 h-4" />
                    <span>Authentication Methods</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose at least 3 authentication methods for enhanced security:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="face"
                        checked={formData.faceAuth}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, faceAuth: checked as boolean})
                        }
                      />
                      <Label htmlFor="face" className="text-sm">
                        Face Recognition
                        <span className="ml-2 px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">Recommended</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="voice"
                        checked={formData.voiceAuth}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, voiceAuth: checked as boolean})
                        }
                      />
                      <Label htmlFor="voice" className="text-sm">
                        Voice Authentication
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Recommended</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gesture"
                        checked={formData.gestureAuth}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, gestureAuth: checked as boolean})
                        }
                      />
                      <Label htmlFor="gesture" className="text-sm">
                        Gesture Recognition
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Recommended</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bodyPattern"
                        checked={formData.bodyPatternAuth}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, bodyPatternAuth: checked as boolean})
                        }
                      />
                      <Label htmlFor="bodyPattern" className="text-sm">
                        Body Pattern Analysis
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">AI-Powered</span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                Create Account & Setup Biometrics
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-cyan-500 hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
