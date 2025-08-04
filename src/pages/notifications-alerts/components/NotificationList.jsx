import React from 'react';
import NotificationCard from './NotificationCard';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const NotificationList = ({ 
  notifications, 
  selectedNotifications, 
  onNotificationSelect,
  onMarkRead,
  onArchive,
  onAction,
  loading 
}) => {
  const handleSelectNotification = (notificationId, checked) => {
    onNotificationSelect(notificationId, checked);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-muted rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
        <p className="text-muted-foreground">You're all caught up! No new notifications to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-start space-x-3">
          <div className="pt-4">
            <Checkbox
              checked={selectedNotifications.includes(notification.id)}
              onChange={(e) => handleSelectNotification(notification.id, e.target.checked)}
            />
          </div>
          
          <div className="flex-1">
            <NotificationCard
              notification={notification}
              onMarkRead={onMarkRead}
              onArchive={onArchive}
              onAction={onAction}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;