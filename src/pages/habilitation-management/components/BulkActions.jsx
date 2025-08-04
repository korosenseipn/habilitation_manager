import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'approve', label: 'Approve Selected' },
    { value: 'revoke', label: 'Revoke Selected' },
    { value: 'extend', label: 'Extend Expiration' },
    { value: 'export', label: 'Export Selected' },
    { value: 'delete', label: 'Delete Selected' }
  ];

  const handleActionExecute = () => {
    if (selectedAction && selectedCount > 0) {
      const actionLabels = {
        approve: 'approve',
        revoke: 'revoke',
        extend: 'extend expiration for',
        export: 'export',
        delete: 'delete'
      };

      const action = actionLabels[selectedAction];
      const confirmMessage = `Are you sure you want to ${action} ${selectedCount} selected habilitation${selectedCount > 1 ? 's' : ''}?`;
      
      if (window.confirm(confirmMessage)) {
        onBulkAction(selectedAction);
        setSelectedAction('');
      }
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'approve':
        return 'CheckCircle';
      case 'revoke':
        return 'XCircle';
      case 'extend':
        return 'Calendar';
      case 'export':
        return 'Download';
      case 'delete':
        return 'Trash2';
      default:
        return 'Settings';
    }
  };

  const getActionVariant = (action) => {
    switch (action) {
      case 'approve':
        return 'success';
      case 'revoke': case'delete':
        return 'destructive';
      case 'extend':
        return 'warning';
      case 'export':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-accent" />
            <span className="font-medium text-foreground">
              {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear Selection
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="min-w-48">
            <Select
              options={bulkActionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Select action..."
            />
          </div>
          
          <Button
            variant={selectedAction ? getActionVariant(selectedAction) : 'default'}
            onClick={handleActionExecute}
            disabled={!selectedAction}
            iconName={selectedAction ? getActionIcon(selectedAction) : 'Play'}
            iconPosition="left"
          >
            Execute
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-accent/20">
        <span className="text-sm text-muted-foreground mr-2">Quick actions:</span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('approve')}
          iconName="CheckCircle"
          iconPosition="left"
          className="text-success hover:text-success"
        >
          Approve All
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('export')}
          iconName="Download"
          iconPosition="left"
        >
          Export
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('extend')}
          iconName="Calendar"
          iconPosition="left"
          className="text-warning hover:text-warning"
        >
          Extend
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;