import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCard = ({ notification, onMarkRead, onArchive, onAction }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      case 'high':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'medium':
        return 'text-accent bg-accent/10 border-accent/20';
      case 'low':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'expiration':
        return 'AlertTriangle';
      case 'approval':
        return 'CheckCircle';
      case 'system':
        return 'Settings';
      case 'compliance':
        return 'Shield';
      default:
        return 'Bell';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`
      bg-card border border-border rounded-lg p-4 transition-smooth hover:shadow-card
      ${!notification.read ? 'border-l-4 border-l-primary' : ''}
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-1">
            <Icon
              name={getCategoryIcon(notification.category)}
              size={20}
              className={notification.priority === 'critical' ? 'text-error' : 'text-muted-foreground'}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`
                text-sm font-medium truncate
                ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                {notification.title}
              </h3>
              
              <span className={`
                px-2 py-0.5 text-xs rounded-full border flex-shrink-0
                ${getPriorityColor(notification.priority)}
              `}>
                {notification.priority}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {notification.message}
            </p>
            
            {notification.affectedUsers && (
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Users" size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Affects: {notification.affectedUsers.join(', ')}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(notification.timestamp)}
              </span>
              
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMarkRead(notification.id)}
            className="w-8 h-8"
          >
            <Icon 
              name={notification.read ? "Mail" : "MailOpen"} 
              size={14} 
            />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onArchive(notification.id)}
            className="w-8 h-8"
          >
            <Icon name="Archive" size={14} />
          </Button>
        </div>
      </div>
      
      {notification.actionRequired && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
          {notification.actions?.map((action, index) => (
            <Button
              key={index}
              variant={action.type === 'primary' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onAction(notification.id, action.id)}
              iconName={action.icon}
              iconPosition="left"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCard;