import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const NotificationFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'archived', label: 'Archived' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
    { value: 'category', label: 'Category' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== 'all' && value !== ''
  );

  return (
    <div className="bg-card border-b border-border">
      <div className="p-4">
        {/* Quick Filters Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
              <Select
                options={priorityOptions}
                value={filters.priority}
                onChange={(value) => handleFilterChange('priority', value)}
                placeholder="Priority"
                className="w-32"
              />
              
              <Select
                options={statusOptions}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                placeholder="Status"
                className="w-32"
              />
              
              <Select
                options={sortOptions}
                value={filters.sort}
                onChange={(value) => handleFilterChange('sort', value)}
                placeholder="Sort by"
                className="w-36"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
                className="text-muted-foreground"
              >
                Clear
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
              className="md:hidden"
            >
              More Filters
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search notifications..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Expanded Filters (Mobile) */}
        {(isExpanded || window.innerWidth >= 768) && (
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Priority"
              options={priorityOptions}
              value={filters.priority}
              onChange={(value) => handleFilterChange('priority', value)}
            />
            
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Sort by"
              options={sortOptions}
              value={filters.sort}
              onChange={(value) => handleFilterChange('sort', value)}
            />
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === 'all' || value === '') return null;
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                >
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange(key, key === 'search' ? '' : 'all')}
                    className="hover:bg-primary/20 rounded-sm p-0.5"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationFilters;