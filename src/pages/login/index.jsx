import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyLogo from './components/CompanyLogo';
import LoginForm from './components/LoginForm';
import SSOOptions from './components/SSOOptions';
import SecurityBadges from './components/SecurityBadges';
import CredentialsHelper from './components/CredentialsHelper';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-card border border-border rounded-xl shadow-modal p-8">
          {/* Company Logo */}
          <CompanyLogo />
          
          {/* Login Form */}
          <LoginForm />
          
          {/* SSO Options */}
          <div className="mt-6">
            <SSOOptions />
          </div>
          
          {/* Demo Credentials Helper */}
          <CredentialsHelper />
        </div>
        
        {/* Security Badges */}
        <SecurityBadges />
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Habilitations Manager. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-smooth">
              Privacy Policy
            </a>
            <span className="text-xs text-muted-foreground">•</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-smooth">
              Terms of Service
            </a>
            <span className="text-xs text-muted-foreground">•</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-smooth">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;