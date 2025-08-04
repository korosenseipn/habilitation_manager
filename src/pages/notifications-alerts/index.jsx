import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';

import NotificationTabs from './components/NotificationTabs';
import NotificationFilters from './components/NotificationFilters';
import NotificationList from './components/NotificationList';
import BulkActions from './components/BulkActions';
import NotificationPreferences from './components/NotificationPreferences';

const NotificationsAlerts = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    status: 'all',
    sort: 'newest'
  });

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      title: 'Security Clearance Expiring Soon',
      message: 'John Doe\'s Level 3 security clearance will expire in 7 days. Immediate renewal required to maintain system access.',
      category: 'expiration',
      priority: 'critical',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionRequired: true,
      affectedUsers: ['John Doe'],
      actions: [
        { id: 'renew', label: 'Renew Now', type: 'primary', icon: 'RefreshCw' },
        { id: 'extend', label: 'Request Extension', type: 'secondary', icon: 'Clock' }
      ]
    },
    {
      id: 2,
      title: 'New Habilitation Request',
      message: 'Sarah Wilson has requested access to Database Administration systems. Review and approval required.',
      category: 'approval',
      priority: 'high',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      actionRequired: true,
      affectedUsers: ['Sarah Wilson'],
      actions: [
        { id: 'approve', label: 'Approve', type: 'primary', icon: 'Check' },
        { id: 'reject', label: 'Reject', type: 'secondary', icon: 'X' },
        { id: 'review', label: 'Review Details', type: 'secondary', icon: 'Eye' }
      ]
    },
    {
      id: 3,
      title: 'Compliance Report Generated',
      message: 'Monthly habilitation compliance report for July 2025 has been generated and is ready for review.',
      category: 'compliance',
      priority: 'medium',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      actionRequired: true,
      actions: [
        { id: 'view', label: 'View Report', type: 'primary', icon: 'FileText' },
        { id: 'download', label: 'Download', type: 'secondary', icon: 'Download' }
      ]
    },
    {
      id: 4,
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance will occur tonight at 2:00 AM EST. System will be unavailable for approximately 2 hours.',
      category: 'system',
      priority: 'medium',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      actionRequired: false
    },
    {
      id: 5,
      title: 'Multiple Certifications Expiring',
      message: 'Warning: 15 habilitations are set to expire within the next 30 days. Review and renewal actions required.',
      category: 'expiration',
      priority: 'high',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: false,
      actionRequired: true,
      affectedUsers: ['Multiple Users'],
      actions: [
        { id: 'viewList', label: 'View List', type: 'primary', icon: 'List' },
        { id: 'bulkRenew', label: 'Bulk Renew', type: 'secondary', icon: 'RefreshCw' }
      ]
    },
    {
      id: 6,
      title: 'Access Revoked',
      message: 'Emergency access revocation completed for user Mike Johnson due to security policy violation.',
      category: 'compliance',
      priority: 'critical',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      read: true,
      actionRequired: false,
      affectedUsers: ['Mike Johnson']
    },
    {
      id: 7,
      title: 'New User Onboarding',
      message: 'Emma Davis has been added to the system and requires initial habilitation assignment.',
      category: 'approval',
      priority: 'medium',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      read: false,
      actionRequired: true,
      affectedUsers: ['Emma Davis'],
      actions: [
        { id: 'assign', label: 'Assign Habilitations', type: 'primary', icon: 'UserPlus' }
      ]
    },
    {
      id: 8,
      title: 'Audit Trail Updated',
      message: 'System audit trail has been updated with recent habilitation changes. Review recommended.',
      category: 'system',
      priority: 'low',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      read: true,
      actionRequired: false
    }
  ];

  // Filter notifications based on active tab and filters
  const filteredNotifications = mockNotifications.filter(notification => {
    // Tab filtering
    if (activeTab !== 'all' && notification.category !== activeTab) {
      return false;
    }

    // Search filtering
    if (filters.search && !notification.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !notification.message.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Priority filtering
    if (filters.priority !== 'all' && notification.priority !== filters.priority) {
      return false;
    }

    // Status filtering
    if (filters.status === 'unread' && notification.read) return false;
    if (filters.status === 'read' && !notification.read) return false;

    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp);
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'category':
        return a.category.localeCompare(b.category);
      default: // newest
        return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  // Calculate notification counts for tabs
  const notificationCounts = {
    all: mockNotifications.length,
    expiration: mockNotifications.filter(n => n.category === 'expiration').length,
    approval: mockNotifications.filter(n => n.category === 'approval').length,
    system: mockNotifications.filter(n => n.category === 'system').length,
    compliance: mockNotifications.filter(n => n.category === 'compliance').length
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedNotifications([]);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      priority: 'all',
      status: 'all',
      sort: 'newest'
    });
  };

  const handleNotificationSelect = (notificationId, checked) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, notificationId]);
    } else {
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
    }
  };

  const handleSelectAll = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id));
  };

  const handleClearSelection = () => {
    setSelectedNotifications([]);
  };

  const handleMarkRead = (notificationId) => {
    console.log('Marking notification as read:', notificationId);
    // Implementation for marking notification as read
  };

  const handleArchive = (notificationId) => {
    console.log('Archiving notification:', notificationId);
    // Implementation for archiving notification
  };

  const handleAction = (notificationId, actionId) => {
    console.log('Performing action:', actionId, 'on notification:', notificationId);
    
    // Handle different actions
    switch (actionId) {
      case 'renew': case'approve': case'assign': navigate('/habilitation-management');
        break;
      case 'view': case'viewList': navigate('/compliance-reporting');
        break;
      case 'review': navigate('/user-profile-management');
        break;
      default:
        console.log('Action not implemented:', actionId);
    }
  };

  const handleBulkMarkRead = () => {
    console.log('Bulk marking as read:', selectedNotifications);
    setSelectedNotifications([]);
  };

  const handleBulkArchive = () => {
    console.log('Bulk archiving:', selectedNotifications);
    setSelectedNotifications([]);
  };

  const handleBulkDelete = () => {
    console.log('Bulk deleting:', selectedNotifications);
    setSelectedNotifications([]);
  };

  // Enable browser notifications on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onSidebarToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  Notifications & Alerts
                </h1>
                <p className="text-muted-foreground">
                  Manage system notifications, alerts, and communication preferences
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={() => setPreferencesOpen(true)}
                  iconName="Settings"
                  iconPosition="left"
                >
                  Preferences
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => handleMarkRead('all')}
                  iconName="MailOpen"
                  iconPosition="left"
                >
                  Mark All Read
                </Button>
              </div>
            </div>

            {/* Notification Tabs */}
            <NotificationTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              notificationCounts={notificationCounts}
            />

            {/* Filters */}
            <NotificationFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />

            {/* Bulk Actions */}
            <BulkActions
              selectedNotifications={selectedNotifications}
              totalNotifications={filteredNotifications.length}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onBulkMarkRead={handleBulkMarkRead}
              onBulkArchive={handleBulkArchive}
              onBulkDelete={handleBulkDelete}
            />

            {/* Notifications List */}
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6">
                <NotificationList
                  notifications={filteredNotifications}
                  selectedNotifications={selectedNotifications}
                  onNotificationSelect={handleNotificationSelect}
                  onMarkRead={handleMarkRead}
                  onArchive={handleArchive}
                  onAction={handleAction}
                  loading={loading}
                />
              </div>
            </div>

            {/* Load More Button */}
            {filteredNotifications.length > 0 && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => console.log('Loading more notifications...')}
                  iconName="ChevronDown"
                  iconPosition="right"
                >
                  Load More Notifications
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Notification Preferences Modal */}
      <NotificationPreferences
        isOpen={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
      />
    </div>
  );
};

export default NotificationsAlerts;