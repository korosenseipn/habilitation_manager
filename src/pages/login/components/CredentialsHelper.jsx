import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CredentialsHelper = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockCredentials = [
    {
      role: 'Administrator',
      email: 'admin@company.com',
      password: 'Admin123!',
      description: 'Full system access and management'
    },
    {
      role: 'Manager',
      email: 'manager@company.com',
      password: 'Manager123!',
      description: 'Department-level management access'
    },
    {
      role: 'User',
      email: 'user@company.com',
      password: 'User123!',
      description: 'Standard user access'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        className="w-full text-muted-foreground"
      >
        Demo Credentials
      </Button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
          <p className="text-xs text-muted-foreground mb-3">
            Use these credentials to test different user roles:
          </p>
          
          <div className="space-y-3">
            {mockCredentials.map((cred, index) => (
              <div key={index} className="bg-background rounded-md p-3 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {cred.role}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {cred.description}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Email:</span>
                    <div className="flex items-center space-x-1">
                      <code className="text-xs bg-muted px-1 rounded">
                        {cred.email}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(cred.email)}
                        className="h-6 w-6"
                      >
                        <Icon name="Copy" size={12} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Password:</span>
                    <div className="flex items-center space-x-1">
                      <code className="text-xs bg-muted px-1 rounded">
                        {cred.password}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(cred.password)}
                        className="h-6 w-6"
                      >
                        <Icon name="Copy" size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;