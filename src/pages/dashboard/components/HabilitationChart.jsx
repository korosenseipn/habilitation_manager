import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import Button from '../../../components/ui/Button';

const HabilitationChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('6months');

  const chartData = [
    { month: 'Jan', active: 245, expired: 12, pending: 8, new: 15 },
    { month: 'Feb', active: 252, expired: 8, pending: 12, new: 18 },
    { month: 'Mar', active: 268, expired: 15, pending: 6, new: 22 },
    { month: 'Apr', active: 275, expired: 10, pending: 14, new: 19 },
    { month: 'May', active: 289, expired: 18, pending: 9, new: 25 },
    { month: 'Jun', active: 295, expired: 7, pending: 11, new: 16 }
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
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-popover-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Habilitation Trends</h3>
          <p className="text-sm text-muted-foreground">Track certification status over time</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
              iconPosition="left"
            >
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
              iconPosition="left"
            >
              Bar
            </Button>
          </div>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year</option>
          </select>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
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
                dataKey="active" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                name="Active"
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expired" 
                stroke="var(--color-error)" 
                strokeWidth={2}
                name="Expired"
                dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="var(--color-warning)" 
                strokeWidth={2}
                name="Pending"
                dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="new" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                name="New"
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
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
              <Bar dataKey="active" fill="var(--color-primary)" name="Active" />
              <Bar dataKey="expired" fill="var(--color-error)" name="Expired" />
              <Bar dataKey="pending" fill="var(--color-warning)" name="Pending" />
              <Bar dataKey="new" fill="var(--color-success)" name="New" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HabilitationChart;