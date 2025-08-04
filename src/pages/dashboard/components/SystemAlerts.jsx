import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Multiple Certifications Expiring',
      message: '5 security clearances expire within 48 hours',
      timestamp: '10 minutes ago',
      actionRequired: true,
      dismissed: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pending Approval Queue',
      message: '12 habilitation requests awaiting approval',
      timestamp: '1 hour ago',
      actionRequired: true,
      dismissed: false
    },
    {
      id: 3,
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Maintenance window: Tonight 2:00 AM - 4:00 AM EST',
      timestamp: '2 hours ago',
      actionRequired: false,
      dismissed: false
    },
    {
      id: 4,
      type: 'success',
      title: 'Backup Completed Successfully',
      message: 'Daily system backup completed at 3:00 AM',
      timestamp: '8 hours ago',
      actionRequired: false,
      dismissed: false
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Info';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-accent bg-accent/10 border-accent/20';
    }
  };

  const handleDismissAlert = (alertId, e) => {
    e.stopPropagation();
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const handleAlertClick = (alert) => {
    if (alert.type === 'critical' || alert.type === 'warning') {
      if (alert.title.includes('Certifications Expiring')) {
        navigate('/habilitation-management');
      } else if (alert.title.includes('Approval Queue')) {
        navigate('/habilitation-management');
      }
    } else {
      navigate('/notifications-alerts');
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const criticalCount = activeAlerts.filter(alert => alert.type === 'critical').length;
  const warningCount = activeAlerts.filter(alert => alert.type === 'warning').length;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">System Alerts</h3>
          <div className="flex items-center space-x-4 text-sm">
            {criticalCount > 0 && (
              <span className="text-error">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-warning">
                {warningCount} Warning
              </span>
            )}
            {criticalCount === 0 && warningCount === 0 && (
              <span className="text-success">All Clear</span>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          iconName="Settings"
          onClick={() => navigate('/notifications-alerts')}
        >
          Manage
        </Button>
      </div>

      <div className="space-y-3">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
            <p className="text-muted-foreground">No active alerts</p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert)}
              className={`
                p-4 rounded-lg border cursor-pointer transition-smooth hover:shadow-sm
                ${getAlertColor(alert.type)}
              `}
            >
              <div className="flex items-start space-x-3">
                <Icon name={getAlertIcon(alert.type)} size={18} className="flex-shrink-0 mt-0.5" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm mb-1">
                      {alert.title}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDismissAlert(alert.id, e)}
                      className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                    >
                      <Icon name="X" size={12} />
                    </Button>
                  </div>
                  
                  <p className="text-sm opacity-90 mb-2">
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-70">
                      {alert.timestamp}
                    </span>
                    {alert.actionRequired && (
                      <div className="flex items-center space-x-1 text-xs">
                        <Icon name="Clock" size={12} />
                        <span>Action Required</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activeAlerts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            iconName="Bell"
            onClick={() => navigate('/notifications-alerts')}
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default SystemAlerts;