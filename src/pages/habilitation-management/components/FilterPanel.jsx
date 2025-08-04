import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ filters, onFiltersChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'expiring', label: 'Expiring Soon' },
    { value: 'expired', label: 'Expired' },
    { value: 'pending', label: 'Pending' },
    { value: 'revoked', label: 'Revoked' }
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'Security', label: 'Security' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Compliance', label: 'Compliance' }
  ];

  const certificationOptions = [
    { value: '', label: 'All Certifications' },
    { value: 'Security Clearance Level 1', label: 'Security Clearance Level 1' },
    { value: 'Security Clearance Level 2', label: 'Security Clearance Level 2' },
    { value: 'Security Clearance Level 3', label: 'Security Clearance Level 3' },
    { value: 'System Administrator', label: 'System Administrator' },
    { value: 'Database Access', label: 'Database Access' },
    { value: 'Network Administrator', label: 'Network Administrator' },
    { value: 'Compliance Officer', label: 'Compliance Officer' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search by user name, email, or certification..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            Advanced Filters
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onReset}
              iconName="X"
              iconPosition="left"
              className="text-muted-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
          <Select
            label="Status"
            options={statusOptions}
            value={filters.status || ''}
            onChange={(value) => handleFilterChange('status', value)}
          />
          
          <Select
            label="Department"
            options={departmentOptions}
            value={filters.department || ''}
            onChange={(value) => handleFilterChange('department', value)}
          />
          
          <Select
            label="Certification Type"
            options={certificationOptions}
            value={filters.certificationType || ''}
            onChange={(value) => handleFilterChange('certificationType', value)}
            searchable
          />
          
          <div className="space-y-4">
            <Input
              type="date"
              label="Expiration From"
              value={filters.expirationFrom || ''}
              onChange={(e) => handleFilterChange('expirationFrom', e.target.value)}
            />
            <Input
              type="date"
              label="Expiration To"
              value={filters.expirationTo || ''}
              onChange={(e) => handleFilterChange('expirationTo', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => {
            if (!value || key === 'search') return null;
            
            let label = value;
            if (key === 'status') {
              label = statusOptions.find(opt => opt.value === value)?.label || value;
            } else if (key === 'department') {
              label = departmentOptions.find(opt => opt.value === value)?.label || value;
            } else if (key === 'certificationType') {
              label = certificationOptions.find(opt => opt.value === value)?.label || value;
            }
            
            return (
              <span
                key={key}
                className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
              >
                <span>{label}</span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;