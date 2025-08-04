import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusBadge = ({ status, size = 'default' }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          color: 'bg-success text-success-foreground',
          icon: 'CheckCircle',
          label: 'Active'
        };
      case 'expiring':
        return {
          color: 'bg-warning text-warning-foreground',
          icon: 'AlertTriangle',
          label: 'Expiring'
        };
      case 'expired':
        return {
          color: 'bg-error text-error-foreground',
          icon: 'XCircle',
          label: 'Expired'
        };
      case 'pending':
        return {
          color: 'bg-secondary text-secondary-foreground',
          icon: 'Clock',
          label: 'Pending'
        };
      case 'revoked':
        return {
          color: 'bg-destructive text-destructive-foreground',
          icon: 'Ban',
          label: 'Revoked'
        };
      default:
        return {
          color: 'bg-muted text-muted-foreground',
          icon: 'HelpCircle',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`inline-flex items-center space-x-1 rounded-full font-medium ${config.color} ${sizeClasses}`}>
      <Icon name={config.icon} size={iconSize} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;