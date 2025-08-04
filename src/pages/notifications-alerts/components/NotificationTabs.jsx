import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationTabs = ({ activeTab, onTabChange, notificationCounts }) => {
  const tabs = [
    {
      id: 'all',
      label: 'All',
      icon: 'Bell',
      count: notificationCounts.all
    },
    {
      id: 'expiration',
      label: 'Expiration Alerts',
      icon: 'AlertTriangle',
      count: notificationCounts.expiration
    },
    {
      id: 'approval',
      label: 'Approval Requests',
      icon: 'CheckCircle',
      count: notificationCounts.approval
    },
    {
      id: 'system',
      label: 'System Updates',
      icon: 'Settings',
      count: notificationCounts.system
    },
    {
      id: 'compliance',
      label: 'Compliance Warnings',
      icon: 'Shield',
      count: notificationCounts.compliance
    }
  ];

  return (
    <div className="border-b border-border bg-card">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap
              border-b-2 transition-smooth min-w-0 flex-shrink-0
              ${activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }
            `}
          >
            <Icon name={tab.icon} size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            {tab.count > 0 && (
              <span className={`
                px-2 py-0.5 text-xs rounded-full
                ${activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationTabs;