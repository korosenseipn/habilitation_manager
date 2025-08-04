import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationPreferences = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    browserNotifications: true,
    smsNotifications: false,
    expirationAlerts: true,
    approvalRequests: true,
    systemUpdates: false,
    complianceWarnings: true,
    frequency: 'immediate',
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  });

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly Digest' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Digest' }
  ];

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Save preferences logic
    console.log('Saving preferences:', preferences);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Delivery Methods */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-4">Delivery Methods</h3>
              <div className="space-y-3">
                <Checkbox
                  label="Email Notifications"
                  description="Receive notifications via email"
                  checked={preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                />
                
                <Checkbox
                  label="Browser Notifications"
                  description="Show desktop notifications in browser"
                  checked={preferences.browserNotifications}
                  onChange={(e) => handlePreferenceChange('browserNotifications', e.target.checked)}
                />
                
                <Checkbox
                  label="SMS Notifications"
                  description="Receive critical alerts via SMS"
                  checked={preferences.smsNotifications}
                  onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                />
              </div>
            </div>

            {/* Notification Types */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-4">Notification Types</h3>
              <div className="space-y-3">
                <Checkbox
                  label="Expiration Alerts"
                  description="Notifications about expiring habilitations"
                  checked={preferences.expirationAlerts}
                  onChange={(e) => handlePreferenceChange('expirationAlerts', e.target.checked)}
                />
                
                <Checkbox
                  label="Approval Requests"
                  description="Notifications for pending approvals"
                  checked={preferences.approvalRequests}
                  onChange={(e) => handlePreferenceChange('approvalRequests', e.target.checked)}
                />
                
                <Checkbox
                  label="System Updates"
                  description="Notifications about system maintenance and updates"
                  checked={preferences.systemUpdates}
                  onChange={(e) => handlePreferenceChange('systemUpdates', e.target.checked)}
                />
                
                <Checkbox
                  label="Compliance Warnings"
                  description="Notifications about compliance issues"
                  checked={preferences.complianceWarnings}
                  onChange={(e) => handlePreferenceChange('complianceWarnings', e.target.checked)}
                />
              </div>
            </div>

            {/* Frequency Settings */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-4">Frequency Settings</h3>
              <Select
                label="Notification Frequency"
                description="How often you want to receive notifications"
                options={frequencyOptions}
                value={preferences.frequency}
                onChange={(value) => handlePreferenceChange('frequency', value)}
                className="mb-4"
              />
            </div>

            {/* Quiet Hours */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-4">Quiet Hours</h3>
              <Checkbox
                label="Enable Quiet Hours"
                description="Suppress non-critical notifications during specified hours"
                checked={preferences.quietHours}
                onChange={(e) => handlePreferenceChange('quietHours', e.target.checked)}
                className="mb-4"
              />
              
              {preferences.quietHours && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={preferences.quietStart}
                      onChange={(e) => handlePreferenceChange('quietStart', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={preferences.quietEnd}
                      onChange={(e) => handlePreferenceChange('quietEnd', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;