import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import StatusBadge from './StatusBadge';

const HabilitationModal = ({ isOpen, onClose, mode, habilitation, onSave }) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    certificationType: '',
    department: '',
    issueDate: '',
    expirationDate: '',
    status: 'pending',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const departmentOptions = [
    { value: 'IT', label: 'Information Technology' },
    { value: 'Security', label: 'Security' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Compliance', label: 'Compliance' }
  ];

  const certificationOptions = [
    { value: 'Security Clearance Level 1', label: 'Security Clearance Level 1' },
    { value: 'Security Clearance Level 2', label: 'Security Clearance Level 2' },
    { value: 'Security Clearance Level 3', label: 'Security Clearance Level 3' },
    { value: 'System Administrator', label: 'System Administrator' },
    { value: 'Database Access', label: 'Database Access' },
    { value: 'Network Administrator', label: 'Network Administrator' },
    { value: 'Compliance Officer', label: 'Compliance Officer' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'expired', label: 'Expired' },
    { value: 'revoked', label: 'Revoked' }
  ];

  useEffect(() => {
    if (isOpen && habilitation) {
      setFormData({
        userName: habilitation.userName || '',
        userEmail: habilitation.userEmail || '',
        certificationType: habilitation.certificationType || '',
        department: habilitation.department || '',
        issueDate: habilitation.issueDate || '',
        expirationDate: habilitation.expirationDate || '',
        status: habilitation.status || 'pending',
        notes: habilitation.notes || ''
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        userName: '',
        userEmail: '',
        certificationType: '',
        department: '',
        issueDate: new Date().toISOString().split('T')[0],
        expirationDate: '',
        status: 'pending',
        notes: ''
      });
    }
    setErrors({});
  }, [isOpen, habilitation, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'User name is required';
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }

    if (!formData.certificationType) {
      newErrors.certificationType = 'Certification type is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required';
    } else if (new Date(formData.expirationDate) <= new Date(formData.issueDate)) {
      newErrors.expirationDate = 'Expiration date must be after issue date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {isViewMode && 'Habilitation Details'}
                {isEditMode && 'Edit Habilitation'}
                {isCreateMode && 'Create New Habilitation'}
              </h2>
              {habilitation && (
                <p className="text-sm text-muted-foreground">
                  {habilitation.userName} - {habilitation.certificationType}
                </p>
              )}
            </div>
          </div>
          
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground border-b border-border pb-2">
                User Information
              </h3>
              
              {isViewMode ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-foreground">{habilitation?.userName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{habilitation?.userEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-foreground">{habilitation?.department}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="User Name"
                    value={formData.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    error={errors.userName}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => handleInputChange('userEmail', e.target.value)}
                    error={errors.userEmail}
                    required
                  />
                  
                  <Select
                    label="Department"
                    options={departmentOptions}
                    value={formData.department}
                    onChange={(value) => handleInputChange('department', value)}
                    error={errors.department}
                    required
                  />
                </div>
              )}
            </div>

            {/* Certification Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground border-b border-border pb-2">
                Certification Details
              </h3>
              
              {isViewMode ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Certification Type</label>
                    <p className="text-foreground">{habilitation?.certificationType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={habilitation?.status} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                    <p className="text-foreground">{formatDate(habilitation?.issueDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expiration Date</label>
                    <p className="text-foreground">{formatDate(habilitation?.expirationDate)}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Select
                    label="Certification Type"
                    options={certificationOptions}
                    value={formData.certificationType}
                    onChange={(value) => handleInputChange('certificationType', value)}
                    error={errors.certificationType}
                    required
                    searchable
                  />
                  
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => handleInputChange('status', value)}
                    required
                  />
                  
                  <Input
                    label="Issue Date"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    error={errors.issueDate}
                    required
                  />
                  
                  <Input
                    label="Expiration Date"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                    error={errors.expirationDate}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6">
            <h3 className="font-medium text-foreground border-b border-border pb-2 mb-4">
              Additional Notes
            </h3>
            
            {isViewMode ? (
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-foreground whitespace-pre-wrap">
                  {habilitation?.notes || 'No additional notes available.'}
                </p>
              </div>
            ) : (
              <textarea
                className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Enter any additional notes or comments..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {isViewMode ? 'Close' : 'Cancel'}
          </Button>
          
          {!isViewMode && (
            <Button
              variant="default"
              onClick={handleSave}
              iconName="Save"
              iconPosition="left"
            >
              {isEditMode ? 'Save Changes' : 'Create Habilitation'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabilitationModal;