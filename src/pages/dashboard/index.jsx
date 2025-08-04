import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import KPICard from './components/KPICard';
import HabilitationChart from './components/HabilitationChart';
import QuickActions from './components/QuickActions';
import ActivityFeed from './components/ActivityFeed';
import ExpirationsList from './components/ExpirationsList';
import SystemAlerts from './components/SystemAlerts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock KPI data
  const kpiData = [
    {
      title: 'Active Habilitations',
      value: '295',
      change: '+12',
      changeType: 'positive',
      icon: 'Shield',
      color: 'primary'
    },
    {
      title: 'Expiring Soon',
      value: '18',
      change: '+5',
      changeType: 'negative',
      icon: 'Clock',
      color: 'warning'
    },
    {
      title: 'Pending Approvals',
      value: '12',
      change: '-3',
      changeType: 'positive',
      icon: 'CheckCircle',
      color: 'accent'
    },
    {
      title: 'Compliance Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'success'
    }
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header onSidebarToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, Admin User
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your habilitations today.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.changeType}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Chart Section - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <HabilitationChart />
            </div>
            
            {/* System Alerts - Takes 1 column on xl screens */}
            <div className="xl:col-span-1">
              <SystemAlerts />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Bottom Section - Activity and Expirations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed />
            <ExpirationsList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;