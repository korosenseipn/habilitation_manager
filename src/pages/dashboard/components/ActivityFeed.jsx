import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'habilitation_created',
      user: 'Sarah Wilson',
      action: 'created new habilitation',
      target: 'Security Clearance Level 2',
      timestamp: '2 minutes ago',
      icon: 'Plus',
      color: 'success'
    },
    {
      id: 2,
      type: 'habilitation_approved',
      user: 'Admin User',
      action: 'approved habilitation for',
      target: 'John Doe - Database Access',
      timestamp: '15 minutes ago',
      icon: 'CheckCircle',
      color: 'primary'
    },
    {
      id: 3,
      type: 'habilitation_expired',
      user: 'System',
      action: 'expired habilitation',
      target: 'Mike Johnson - VPN Access',
      timestamp: '1 hour ago',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      id: 4,
      type: 'user_created',
      user: 'HR Department',
      action: 'added new user',
      target: 'Emma Davis',
      timestamp: '2 hours ago',
      icon: 'UserPlus',
      color: 'accent'
    },
    {
      id: 5,
      type: 'habilitation_revoked',
      user: 'Security Team',
      action: 'revoked habilitation',
      target: 'Tom Brown - Admin Access',
      timestamp: '3 hours ago',
      icon: 'XCircle',
      color: 'error'
    },
    {
      id: 6,
      type: 'report_generated',
      user: 'Compliance Officer',
      action: 'generated compliance report',
      target: 'Monthly Audit Report',
      timestamp: '4 hours ago',
      icon: 'FileText',
      color: 'secondary'
    }
  ];

  const getIconColor = (color) => {
    switch (color) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'accent':
        return 'text-accent';
      case 'secondary':
        return 'text-secondary';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest system activities</p>
        </div>
        <Button variant="ghost" size="sm" iconName="RefreshCw">
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getIconColor(activity.color)}`}>
              <Icon name={activity.icon} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm">
                <span className="font-medium text-foreground">{activity.user}</span>
                <span className="text-muted-foreground"> {activity.action} </span>
                <span className="font-medium text-foreground">{activity.target}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full">
          View All Activity
        </Button>
      </div>
    </div>
  );
};

export default ActivityFeed;
