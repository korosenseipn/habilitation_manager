import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyLogo = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <Icon name="Shield" size={32} color="white" />
        </div>
      </div>
      
      {/* Company Name and Tagline */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Habilitations Manager
        </h1>
        <p className="text-sm text-muted-foreground">
          Secure access to your certification management system
        </p>
      </div>
    </div>
  );
};

export default CompanyLogo;