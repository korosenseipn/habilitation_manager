import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationDropdown = ({ isOpen, onClose, notifications = [] }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Sample notifications data
  const defaultNotifications = [
    {
      id: 1,
      title: 'Certification Expiring Soon',
      message: 'John Doe\'s security clearance expires in 7 days',
      time: '2 hours ago',
      type: 'warning',
      unread: true,
      actionPath: '/habilitation-management'
    },
    {
      id: 2,
      title: 'New User Registration',
      message: 'Sarah Wilson has requested access to Level 2 systems',
      time: '4 hours ago',
      type: 'info',
      unread: true,
      actionPath: '/user-profile-management'
    },
    {
      id: 3,
      title: 'Compliance Report Ready',
      message: 'Monthly habilitation report has been generated',
      time: '1 day ago',
      type: 'success',
      unread: false,
      actionPath: '/compliance-reporting'
    },
    {
      id: 4,
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2:00 AM',
      time: '2 days ago',
      type: 'info',
      unread: false
    },
    {
      id: 5,
      title: 'Access Revoked',
      message: 'Emergency access revocation for user Mike Johnson',
      time: '3 days ago',
      type: 'error',
      unread: false,
      actionPath: '/user-profile-management'
    }
  ];

  const notificationList = notifications.length > 0 ? notifications : defaultNotifications;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification) => {
    if (notification.actionPath) {
      navigate(notification.actionPath);
      onClose();
    }
  };

  const handleViewAll = () => {
    navigate('/notifications-alerts');
    onClose();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'AlertTriangle';
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning':
        return 'text-warning';
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      default:
        return 'text-accent';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-dropdown z-dropdown"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-medium text-popover-foreground">Notifications</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Mark all read
        </Button>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {notificationList.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          notificationList.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`
                p-4 border-b border-border hover:bg-muted cursor-pointer transition-smooth
                ${notification.unread ? 'bg-accent/5' : ''}
                ${notification.actionPath ? 'hover:bg-muted' : 'cursor-default'}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Icon
                    name={getNotificationIcon(notification.type)}
                    size={16}
                    className={getNotificationColor(notification.type)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm text-popover-foreground">
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                    {notification.actionPath && (
                      <Icon name="ChevronRight" size={12} className="text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewAll}
          className="w-full justify-center"
        >
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationDropdown;