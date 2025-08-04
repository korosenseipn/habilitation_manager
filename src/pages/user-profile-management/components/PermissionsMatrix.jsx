import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const PermissionsMatrix = ({ permissions, onUpdatePermissions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handlePermissionChange = (sectionId, permissionId, checked) => {
    const updatedPermissions = permissions.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          permissions: section.permissions.map(permission => {
            if (permission.id === permissionId) {
              return { ...permission, granted: checked };
            }
            return permission;
          })
        };
      }
      return section;
    });
    
    onUpdatePermissions(updatedPermissions);
  };

  const handleSectionToggle = (sectionId, checked) => {
    const updatedPermissions = permissions.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          permissions: section.permissions.map(permission => ({
            ...permission,
            granted: checked
          }))
        };
      }
      return section;
    });
    
    onUpdatePermissions(updatedPermissions);
  };

  const getSectionStatus = (section) => {
    const grantedCount = section.permissions.filter(p => p.granted).length;
    const totalCount = section.permissions.length;
    
    if (grantedCount === 0) return 'none';
    if (grantedCount === totalCount) return 'all';
    return 'partial';
  };

  const filteredPermissions = permissions.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.permissions.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPermissionIcon = (type) => {
    switch (type) {
      case 'read':
        return 'Eye';
      case 'write':
        return 'Edit';
      case 'delete':
        return 'Trash2';
      case 'admin':
        return 'Shield';
      default:
        return 'Key';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Permissions Matrix</h3>
            <p className="text-sm text-muted-foreground">
              Manage user access permissions across different system modules
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="mt-4">
          <Input
            type="search"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Permissions List */}
      <div className="divide-y divide-border">
        {filteredPermissions.map((section) => {
          const sectionStatus = getSectionStatus(section);
          const isExpanded = expandedSections[section.id] !== false; // Default to expanded
          
          return (
            <div key={section.id} className="p-6">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center space-x-2 hover:text-primary transition-smooth"
                  >
                    <Icon
                      name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                      size={16}
                    />
                    <Icon name={section.icon} size={20} className="text-primary" />
                    <h4 className="font-medium text-foreground">{section.name}</h4>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {section.permissions.filter(p => p.granted).length} of {section.permissions.length} granted
                    </span>
                    
                    {sectionStatus === 'partial' && (
                      <div className="w-2 h-2 bg-warning rounded-full" />
                    )}
                    {sectionStatus === 'all' && (
                      <div className="w-2 h-2 bg-success rounded-full" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSectionToggle(section.id, false)}
                    disabled={sectionStatus === 'none'}
                  >
                    Revoke All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSectionToggle(section.id, true)}
                    disabled={sectionStatus === 'all'}
                  >
                    Grant All
                  </Button>
                </div>
              </div>
              
              {/* Section Description */}
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              
              {/* Permissions Grid */}
              {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
                    >
                      <Checkbox
                        checked={permission.granted}
                        onChange={(e) => handlePermissionChange(section.id, permission.id, e.target.checked)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Icon
                            name={getPermissionIcon(permission.type)}
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span className="font-medium text-foreground text-sm">
                            {permission.name}
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {permission.description}
                        </p>
                        
                        {permission.risk && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Icon
                              name="AlertTriangle"
                              size={12}
                              className={`${
                                permission.risk === 'high' ? 'text-error' :
                                permission.risk === 'medium' ? 'text-warning' : 'text-success'
                              }`}
                            />
                            <span className={`text-xs font-medium ${
                              permission.risk === 'high' ? 'text-error' :
                              permission.risk === 'medium' ? 'text-warning' : 'text-success'
                            }`}>
                              {permission.risk.charAt(0).toUpperCase() + permission.risk.slice(1)} Risk
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="p-6 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-muted-foreground">
                Full Access: {permissions.filter(s => getSectionStatus(s) === 'all').length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full" />
              <span className="text-muted-foreground">
                Partial Access: {permissions.filter(s => getSectionStatus(s) === 'partial').length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <span className="text-muted-foreground">
                No Access: {permissions.filter(s => getSectionStatus(s) === 'none').length}
              </span>
            </div>
          </div>
          
          <span className="text-muted-foreground">
            Total Permissions: {permissions.reduce((acc, section) => acc + section.permissions.length, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PermissionsMatrix;