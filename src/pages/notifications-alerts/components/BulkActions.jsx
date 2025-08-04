import React from 'react';

import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActions = ({ 
  selectedNotifications, 
  totalNotifications, 
  onSelectAll, 
  onClearSelection,
  onBulkMarkRead,
  onBulkArchive,
  onBulkDelete
}) => {
  const selectedCount = selectedNotifications.length;
  const isAllSelected = selectedCount === totalNotifications && totalNotifications > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalNotifications;

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={isAllSelected ? onClearSelection : onSelectAll}
            label={`${selectedCount} of ${totalNotifications} selected`}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkMarkRead}
            iconName="MailOpen"
            iconPosition="left"
          >
            Mark Read
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkArchive}
            iconName="Archive"
            iconPosition="left"
          >
            Archive
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDelete}
            iconName="Trash2"
            iconPosition="left"
            className="text-error hover:text-error"
          >
            Delete
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;