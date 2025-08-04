import React from 'react';

import Icon from '../../../components/AppIcon';

const SSOOptions = () => {
  const ssoProviders = [
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: 'Building2',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'bg-white hover:bg-gray-50 border border-border',
      textColor: 'text-foreground'
    }
  ];

  const handleSSOLogin = (provider) => {
    // In a real app, this would initiate SSO flow
    alert(`SSO login with ${provider.name} would be implemented here`);
  };

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* SSO Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {ssoProviders.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSSOLogin(provider)}
            className={`
              w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
              transition-smooth ${provider.color} ${provider.textColor}
            `}
          >
            <Icon name={provider.icon} size={18} />
            <span className="font-medium">Continue with {provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SSOOptions;