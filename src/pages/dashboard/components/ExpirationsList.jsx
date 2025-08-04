import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExpirationsList = () => {
  const navigate = useNavigate();

  const expirations = [
    {
      id: 1,
      user: 'John Doe',
      habilitation: 'Security Clearance Level 3',
      expiryDate: '2025-07-20',
      daysLeft: 3,
      status: 'critical',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 2,
      user: 'Sarah Wilson',
      habilitation: 'Database Administrator',
      expiryDate: '2025-07-25',
      daysLeft: 8,
      status: 'warning',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e0e4e4?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      habilitation: 'Network Access Level 2',
      expiryDate: '2025-08-02',
      daysLeft: 16,
      status: 'warning',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 4,
      user: 'Emma Davis',
      habilitation: 'Application Developer',
      expiryDate: '2025-08-10',
      daysLeft: 24,
      status: 'normal',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 5,
      user: 'Tom Brown',
      habilitation: 'System Administrator',
      expiryDate: '2025-08-15',
      daysLeft: 29,
      status: 'normal',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-error bg-error/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'Clock';
      default:
        return 'Calendar';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDetails = (expiration) => {
    navigate('/habilitation-management', { state: { userId: expiration.id } });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Upcoming Expirations</h3>
          <p className="text-sm text-muted-foreground">Habilitations requiring renewal</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          iconName="Calendar"
          onClick={() => navigate('/habilitation-management')}
        >
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {expirations.map((expiration) => (
          <div 
            key={expiration.id} 
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
            onClick={() => handleViewDetails(expiration)}
          >
            <img
              src={expiration.avatar}
              alt={expiration.user}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {expiration.user}
                </h4>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(expiration.status)}`}>
                  <Icon name={getStatusIcon(expiration.status)} size={12} />
                  <span>{expiration.daysLeft} days</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground truncate mt-1">
                {expiration.habilitation}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Expires: {formatDate(expiration.expiryDate)}
                </p>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          iconName="Mail"
          onClick={() => navigate('/notifications-alerts')}
        >
          Send Renewal Reminders
        </Button>
      </div>
    </div>
  );
};

export default ExpirationsList;