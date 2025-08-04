import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ScheduledReports = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    frequency: 'weekly',
    format: 'pdf',
    recipients: '',
    enabled: true
  });

  const scheduledReports = [
    {
      id: 1,
      name: 'Weekly Compliance Summary',
      frequency: 'Weekly',
      nextRun: '2025-07-21 09:00',
      format: 'PDF',
      recipients: 'admin@company.com, compliance@company.com',
      enabled: true,
      lastRun: '2025-07-14 09:00',
      status: 'active'
    },
    {
      id: 2,
      name: 'Monthly Department Report',
      frequency: 'Monthly',
      nextRun: '2025-08-01 08:00',
      format: 'Excel',
      recipients: 'managers@company.com',
      enabled: true,
      lastRun: '2025-07-01 08:00',
      status: 'active'
    },
    {
      id: 3,
      name: 'Quarterly Audit Report',
      frequency: 'Quarterly',
      nextRun: '2025-10-01 10:00',
      format: 'PDF',
      recipients: 'audit@company.com, ceo@company.com',
      enabled: false,
      lastRun: '2025-04-01 10:00',
      status: 'paused'
    },
    {
      id: 4,
      name: 'Daily Expiration Alerts',
      frequency: 'Daily',
      nextRun: '2025-07-18 07:00',
      format: 'CSV',
      recipients: 'hr@company.com, security@company.com',
      enabled: true,
      lastRun: '2025-07-17 07:00',
      status: 'active'
    }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active', icon: 'Play' },
      paused: { color: 'bg-warning text-warning-foreground', label: 'Paused', icon: 'Pause' },
      error: { color: 'bg-error text-error-foreground', label: 'Error', icon: 'AlertCircle' }
    };

    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  const handleCreateReport = () => {
    console.log('Creating scheduled report:', newReport);
    setShowCreateModal(false);
    setNewReport({
      name: '',
      frequency: 'weekly',
      format: 'pdf',
      recipients: '',
      enabled: true
    });
  };

  const handleToggleReport = (reportId) => {
    console.log('Toggling report:', reportId);
  };

  const handleDeleteReport = (reportId) => {
    console.log('Deleting report:', reportId);
  };

  const handleRunNow = (reportId) => {
    console.log('Running report now:', reportId);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Scheduled Reports</h2>
            <p className="text-sm text-muted-foreground">Automated compliance reporting and notifications</p>
          </div>
          
          <Button
            variant="default"
            onClick={() => setShowCreateModal(true)}
            iconName="Plus"
            iconPosition="left"
          >
            New Schedule
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="divide-y divide-border">
        {scheduledReports.map((report) => (
          <div key={report.id} className="p-6 hover:bg-muted/50 transition-smooth">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-card-foreground">{report.name}</h3>
                  {getStatusBadge(report.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="text-card-foreground">{report.frequency}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Next Run:</span>
                    <span className="text-card-foreground">{report.nextRun}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Format:</span>
                    <span className="text-card-foreground">{report.format}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Recipients:</span>
                    <span className="text-card-foreground">{report.recipients.split(',').length} users</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last run: {report.lastRun}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRunNow(report.id)}
                  iconName="Play"
                  iconPosition="left"
                >
                  Run Now
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleReport(report.id)}
                  iconName={report.enabled ? 'Pause' : 'Play'}
                  iconPosition="left"
                >
                  {report.enabled ? 'Pause' : 'Resume'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteReport(report.id)}
                  iconName="Trash2"
                  iconPosition="left"
                  className="text-error hover:text-error"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Create Scheduled Report</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateModal(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Report Name"
                type="text"
                placeholder="Enter report name"
                value={newReport.name}
                onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              
              <Select
                label="Frequency"
                options={frequencyOptions}
                value={newReport.frequency}
                onChange={(value) => setNewReport(prev => ({ ...prev, frequency: value }))}
              />
              
              <Select
                label="Format"
                options={formatOptions}
                value={newReport.format}
                onChange={(value) => setNewReport(prev => ({ ...prev, format: value }))}
              />
              
              <Input
                label="Recipients"
                type="email"
                placeholder="Enter email addresses (comma separated)"
                value={newReport.recipients}
                onChange={(e) => setNewReport(prev => ({ ...prev, recipients: e.target.value }))}
                description="Separate multiple emails with commas"
                required
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleCreateReport}
                disabled={!newReport.name || !newReport.recipients}
              >
                Create Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledReports;