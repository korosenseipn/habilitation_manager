import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      text: 'SSL Encrypted',
      color: 'text-success'
    },
    {
      icon: 'Lock',
      text: 'SOC 2 Compliant',
      color: 'text-accent'
    },
    {
      icon: 'CheckCircle',
      text: 'ISO 27001 Certified',
      color: 'text-primary'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex flex-wrap items-center justify-center gap-6">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon 
              name={feature.icon} 
              size={16} 
              className={feature.color}
            />
            <span className="text-xs text-muted-foreground font-medium">
              {feature.text}
            </span>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Your data is protected with enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;