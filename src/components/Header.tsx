import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-cyan-500" />
            <span className="text-xl font-bold">
              Bio<span className="text-cyan-500">Quantum</span>Gate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-cyan-500 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-cyan-500 transition-colors">
              About
            </Link>
            <Link to="/features" className="text-muted-foreground hover:text-cyan-500 transition-colors">
              Features
            </Link>
            <Link to="/vip-monitoring" className="text-muted-foreground hover:text-cyan-500 transition-colors">
              VIP Monitor
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link to="/auth">Supabase Auth</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
              <Link to="/register">Register</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-cyan-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-cyan-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/features" 
                className="text-muted-foreground hover:text-cyan-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/vip-monitoring" 
                className="text-muted-foreground hover:text-cyan-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                VIP Monitor
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button asChild variant="ghost" onClick={() => setIsMenuOpen(false)}>
                  <Link to="/auth">Supabase Auth</Link>
                </Button>
                <Button asChild variant="ghost" onClick={() => setIsMenuOpen(false)}>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-cyan-500 hover:bg-cyan-600" onClick={() => setIsMenuOpen(false)}>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;