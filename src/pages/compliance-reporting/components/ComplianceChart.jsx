import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

import Button from '../../../components/ui/Button';

const ComplianceChart = () => {
  const [activeChart, setActiveChart] = useState('trend');

  const trendData = [
    { month: 'Jan', compliant: 85, nonCompliant: 15, expiring: 8 },
    { month: 'Feb', compliant: 82, nonCompliant: 18, expiring: 12 },
    { month: 'Mar', compliant: 88, nonCompliant: 12, expiring: 6 },
    { month: 'Apr', compliant: 90, nonCompliant: 10, expiring: 9 },
    { month: 'May', compliant: 87, nonCompliant: 13, expiring: 11 },
    { month: 'Jun', compliant: 89, nonCompliant: 11, expiring: 7 },
    { month: 'Jul', compliant: 91, nonCompliant: 9, expiring: 5 }
  ];

  const departmentData = [
    { department: 'IT', compliant: 92, nonCompliant: 8, total: 45 },
    { department: 'Security', compliant: 95, nonCompliant: 5, total: 28 },
    { department: 'HR', compliant: 88, nonCompliant: 12, total: 22 },
    { department: 'Finance', compliant: 85, nonCompliant: 15, total: 18 },
    { department: 'Operations', compliant: 82, nonCompliant: 18, total: 35 },
    { department: 'Legal', compliant: 90, nonCompliant: 10, total: 12 }
  ];

  const statusDistribution = [
    { name: 'Compliant', value: 87.5, color: '#10B981' },
    { name: 'Expiring Soon', value: 7.2, color: '#F59E0B' },
    { name: 'Non-Compliant', value: 5.3, color: '#EF4444' }
  ];

  const chartTypes = [
    { id: 'trend', label: 'Compliance Trend', icon: 'TrendingUp' },
    { id: 'department', label: 'By Department', icon: 'Building' },
    { id: 'distribution', label: 'Status Distribution', icon: 'PieChart' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-dropdown">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.dataKey}:</span>
              <span className="font-medium text-popover-foreground">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'trend':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="compliant" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="nonCompliant" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="expiring" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'department':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="department" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="compliant" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="nonCompliant" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'distribution':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Compliance Analytics</h2>
          <p className="text-sm text-muted-foreground">Visual representation of compliance data</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {chartTypes.map((type) => (
            <Button
              key={type.id}
              variant={activeChart === type.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveChart(type.id)}
              iconName={type.icon}
              iconPosition="left"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full" aria-label={`${chartTypes.find(t => t.id === activeChart)?.label} Chart`}>
        {renderChart()}
      </div>

      {/* Legend for trend chart */}
      {activeChart === 'trend' && (
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-sm text-muted-foreground">Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full" />
            <span className="text-sm text-muted-foreground">Non-Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-sm text-muted-foreground">Expiring Soon</span>
          </div>
        </div>
      )}

      {/* Legend for distribution chart */}
      {activeChart === 'distribution' && (
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
          {statusDistribution.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplianceChart;