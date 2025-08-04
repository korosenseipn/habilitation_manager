import React, { useState } from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserProfileCard = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [errors, setErrors] = useState({});

  const departmentOptions = [
    { value: 'it', label: 'Information Technology' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'security', label: 'Security' },
    { value: 'compliance', label: 'Compliance' }
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'analyst', label: 'Analyst' },
    { value: 'specialist', label: 'Specialist' },
    { value: 'coordinator', label: 'Coordinator' },
    { value: 'user', label: 'Standard User' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending Approval' }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser(user);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!editedUser.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!editedUser.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!editedUser.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editedUser.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (!editedUser.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdateUser(editedUser);
      setIsEditing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-secondary text-secondary-foreground';
      case 'suspended':
        return 'bg-error text-error-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-card ${
              user.status === 'active' ? 'bg-success' : 'bg-secondary'
            }`} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ID: {user.id}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Key"
                iconPosition="left"
              >
                Reset Password
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Save"
                iconPosition="left"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground mb-4">Personal Information</h3>
          
          <Input
            label="First Name"
            type="text"
            value={isEditing ? editedUser.firstName : user.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            disabled={!isEditing}
            error={errors.firstName}
            required
          />
          
          <Input
            label="Last Name"
            type="text"
            value={isEditing ? editedUser.lastName : user.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            disabled={!isEditing}
            error={errors.lastName}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            value={isEditing ? editedUser.email : user.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
            error={errors.email}
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={isEditing ? editedUser.phone : user.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
            error={errors.phone}
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-foreground mb-4">Work Information</h3>
          
          <Select
            label="Department"
            options={departmentOptions}
            value={isEditing ? editedUser.department : user.department}
            onChange={(value) => handleInputChange('department', value)}
            disabled={!isEditing}
          />
          
          <Select
            label="Role"
            options={roleOptions}
            value={isEditing ? editedUser.role : user.role}
            onChange={(value) => handleInputChange('role', value)}
            disabled={!isEditing}
          />
          
          <Input
            label="Employee ID"
            type="text"
            value={user.employeeId}
            disabled
            description="Employee ID cannot be changed"
          />
          
          <Select
            label="Account Status"
            options={statusOptions}
            value={isEditing ? editedUser.status : user.status}
            onChange={(value) => handleInputChange('status', value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Created:</span>
            <p className="font-medium text-foreground">{user.createdAt}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Last Login:</span>
            <p className="font-medium text-foreground">{user.lastLogin}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Last Updated:</span>
            <p className="font-medium text-foreground">{user.updatedAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;