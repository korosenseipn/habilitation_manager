import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReportBuilder = ({ onGenerateReport, isGenerating }) => {
  const [reportParams, setReportParams] = useState({
    dateRange: 'last30days',
    customStartDate: '',
    customEndDate: '',
    departments: [],
    certificationTypes: [],
    complianceStatus: 'all',
    reportFormat: 'pdf'
  });

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departmentOptions = [
    { value: 'it', label: 'Information Technology' },
    { value: 'security', label: 'Security' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'legal', label: 'Legal & Compliance' }
  ];

  const certificationOptions = [
    { value: 'security_clearance', label: 'Security Clearance' },
    { value: 'system_access', label: 'System Access' },
    { value: 'data_handling', label: 'Data Handling' },
    { value: 'network_admin', label: 'Network Administration' },
    { value: 'compliance_training', label: 'Compliance Training' },
    { value: 'safety_certification', label: 'Safety Certification' }
  ];

  const complianceStatusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'compliant', label: 'Compliant' },
    { value: 'non_compliant', label: 'Non-Compliant' },
    { value: 'expiring_soon', label: 'Expiring Soon' },
    { value: 'expired', label: 'Expired' },
    { value: 'pending', label: 'Pending Approval' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data' }
  ];

  const handleParamChange = (field, value) => {
    setReportParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateReport = () => {
    onGenerateReport(reportParams);
  };

  const resetParams = () => {
    setReportParams({
      dateRange: 'last30days',
      customStartDate: '',
      customEndDate: '',
      departments: [],
      certificationTypes: [],
      complianceStatus: 'all',
      reportFormat: 'pdf'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={18} color="white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Report Builder</h2>
            <p className="text-sm text-muted-foreground">Configure parameters for compliance reporting</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetParams}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Range Selection */}
        <div className="space-y-4">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={reportParams.dateRange}
            onChange={(value) => handleParamChange('dateRange', value)}
          />
          
          {reportParams.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={reportParams.customStartDate}
                onChange={(e) => handleParamChange('customStartDate', e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={reportParams.customEndDate}
                onChange={(e) => handleParamChange('customEndDate', e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Department Selection */}
        <div>
          <Select
            label="Departments"
            description="Select specific departments or leave empty for all"
            options={departmentOptions}
            value={reportParams.departments}
            onChange={(value) => handleParamChange('departments', value)}
            multiple
            searchable
            clearable
          />
        </div>

        {/* Certification Types */}
        <div>
          <Select
            label="Certification Types"
            description="Filter by specific certification types"
            options={certificationOptions}
            value={reportParams.certificationTypes}
            onChange={(value) => handleParamChange('certificationTypes', value)}
            multiple
            searchable
            clearable
          />
        </div>

        {/* Compliance Status */}
        <div>
          <Select
            label="Compliance Status"
            options={complianceStatusOptions}
            value={reportParams.complianceStatus}
            onChange={(value) => handleParamChange('complianceStatus', value)}
          />
        </div>

        {/* Report Format */}
        <div className="lg:col-span-2">
          <Select
            label="Export Format"
            options={formatOptions}
            value={reportParams.reportFormat}
            onChange={(value) => handleParamChange('reportFormat', value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Report will include data based on selected parameters
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
          >
            Preview
          </Button>
          <Button
            variant="default"
            onClick={handleGenerateReport}
            loading={isGenerating}
            iconName="Download"
            iconPosition="left"
          >
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;