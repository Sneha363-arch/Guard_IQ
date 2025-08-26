
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FaceAuth from "./pages/FaceAuth";
import VoiceAuth from "./pages/VoiceAuth";
import GestureAuth from "./pages/GestureAuth";
import BodyPatternAuth from "./pages/BodyPatternAuth";
import QuantumDashboard from "./pages/QuantumDashboard";
import CyberSecurityDashboard from "./pages/CyberSecurityDashboard";
import LearningLab from "./pages/LearningLab";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import VIPMonitoring from "./pages/VIPMonitoring";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/learning-lab" element={<LearningLab />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/face-auth" element={<FaceAuth />} />
            <Route path="/voice-auth" element={<VoiceAuth />} />
            <Route path="/gesture-auth" element={<GestureAuth />} />
            <Route path="/body-auth" element={<BodyPatternAuth />} />
            <Route path="/quantum-dashboard" element={<QuantumDashboard />} />
            <Route path="/cybersecurity-dashboard" element={<CyberSecurityDashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/vip-monitoring" element={<VIPMonitoring />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
