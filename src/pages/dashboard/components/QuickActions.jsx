import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: 'Add New Habilitation',
      description: 'Create a new certification or authorization',
      icon: 'Plus',
      color: 'primary',
      action: () => navigate('/habilitation-management')
    },
    {
      id: 2,
      title: 'Bulk Import',
      description: 'Import multiple habilitations from CSV/Excel',
      icon: 'Upload',
      color: 'success',
      action: () => navigate('/habilitation-management')
    },
    {
      id: 3,
      title: 'Generate Report',
      description: 'Create compliance and analytics reports',
      icon: 'FileText',
      color: 'accent',
      action: () => navigate('/compliance-reporting')
    },
    {
      id: 4,
      title: 'Manage Users',
      description: 'Add or modify user profiles and permissions',
      icon: 'Users',
      color: 'secondary',
      action: () => navigate('/user-profile-management')
    },
    {
      id: 5,
      title: 'Review Approvals',
      description: 'Process pending habilitation requests',
      icon: 'CheckCircle',
      color: 'warning',
      action: () => navigate('/habilitation-management')
    },
    {
      id: 6,
      title: 'System Alerts',
      description: 'View and manage system notifications',
      icon: 'Bell',
      color: 'error',
      action: () => navigate('/notifications-alerts')
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20 hover:bg-error/20';
      case 'accent':
        return 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
        </div>
        <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`
              p-4 rounded-lg border text-left transition-smooth group
              ${getColorClasses(action.color)}
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon name={action.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1 group-hover:underline">
                  {action.title}
                </h4>
                <p className="text-xs opacity-80 line-clamp-2">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;