import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceMetrics = () => {
  const metrics = [
    {
      id: 1,
      title: 'Overall Compliance',
      value: '87.5%',
      change: '+2.3%',
      changeType: 'positive',
      icon: 'Shield',
      color: 'bg-success',
      description: 'Total compliance rate across all departments'
    },
    {
      id: 2,
      title: 'Expiring Soon',
      value: '23',
      change: '+5',
      changeType: 'warning',
      icon: 'Clock',
      color: 'bg-warning',
      description: 'Certifications expiring within 30 days'
    },
    {
      id: 3,
      title: 'Non-Compliant',
      value: '12',
      change: '-3',
      changeType: 'positive',
      icon: 'AlertTriangle',
      color: 'bg-error',
      description: 'Users currently non-compliant'
    },
    {
      id: 4,
      title: 'Pending Approvals',
      value: '8',
      change: '+2',
      changeType: 'neutral',
      icon: 'Clock3',
      color: 'bg-accent',
      description: 'Habilitations awaiting approval'
    }
  ];

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return 'TrendingUp';
      case 'warning':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
              <Icon name={metric.icon} size={24} color="white" />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
              <Icon name={getChangeIcon(metric.changeType)} size={16} />
              <span className="text-sm font-medium">{metric.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-card-foreground">{metric.value}</h3>
            <p className="text-sm font-medium text-card-foreground">{metric.title}</p>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplianceMetrics;