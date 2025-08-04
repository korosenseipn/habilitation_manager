import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ActivityLogs = ({ activities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  const typeOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'login', label: 'Login/Logout' },
    { value: 'permission', label: 'Permission Changes' },
    { value: 'habilitation', label: 'Habilitation Updates' },
    { value: 'profile', label: 'Profile Changes' },
    { value: 'system', label: 'System Actions' }
  ];

  const dateRangeOptions = [
    { value: '1day', label: 'Last 24 hours' },
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: 'all', label: 'All time' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return 'LogIn';
      case 'logout':
        return 'LogOut';
      case 'permission':
        return 'Shield';
      case 'habilitation':
        return 'Award';
      case 'profile':
        return 'User';
      case 'system':
        return 'Settings';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'login':
        return 'text-success';
      case 'logout':
        return 'text-muted-foreground';
      case 'permission':
        return 'text-warning';
      case 'habilitation':
        return 'text-primary';
      case 'profile':
        return 'text-accent';
      case 'system':
        return 'text-secondary';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-error text-error-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    
    // Simple date filtering (in real app, you'd use proper date comparison)
    let matchesDate = true;
    if (dateRange !== 'all') {
      const activityDate = new Date(activity.timestamp);
      const now = new Date();
      const daysAgo = parseInt(dateRange.replace('days', '').replace('day', ''));
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      matchesDate = activityDate >= cutoffDate;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Activity Logs</h3>
            <p className="text-sm text-muted-foreground">
              Track user actions and system events
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export Logs
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Filter by type"
            className="w-full md:w-48"
          />
          
          <Select
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
            placeholder="Date range"
            className="w-full md:w-48"
          />
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Activity" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No activities found</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-muted/50 transition-smooth">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
                  <Icon
                    name={getActivityIcon(activity.type)}
                    size={16}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.details}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                        
                        <span className="text-xs text-muted-foreground">
                          IP: {activity.ipAddress}
                        </span>
                        
                        {activity.userAgent && (
                          <span className="text-xs text-muted-foreground">
                            {activity.userAgent}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {activity.severity && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(activity.severity)}`}>
                          {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
                        </span>
                      )}
                      
                      {activity.success === false && (
                        <Icon name="AlertCircle" size={16} className="text-error" />
                      )}
                    </div>
                  </div>
                  
                  {activity.metadata && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          Additional Details
                        </summary>
                        <div className="mt-2 space-y-1">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium">{key}:</span>
                              <span className="text-muted-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;