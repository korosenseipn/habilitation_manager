import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import UserProfileCard from './components/UserProfileCard';
import HabilitationHistoryTable from './components/HabilitationHistoryTable';
import PermissionsMatrix from './components/PermissionsMatrix';
import ActivityLogs from './components/ActivityLogs';
import DocumentAttachments from './components/DocumentAttachments';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const UserProfileManagement = () => {
  const { userId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock users data - expanded to include all users
  const mockUsers = {
    'USR-001': {
      id: 'USR-001',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c0b1a1?w=400&h=400&fit=crop&crop=face',
      department: 'it',
      role: 'analyst',
      employeeId: 'EMP-2024-001',
      status: 'active',
      createdAt: 'January 15, 2024',
      lastLogin: 'July 17, 2025 at 10:30 AM',
      updatedAt: 'July 16, 2025'
    },
    'USR-002': {
      id: 'USR-002',
      firstName: 'John',
      lastName: 'Davis',
      email: 'john.davis@company.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      department: 'finance',
      role: 'analyst',
      employeeId: 'EMP-2024-002',
      status: 'active',
      createdAt: 'February 20, 2024',
      lastLogin: 'July 16, 2025 at 2:15 PM',
      updatedAt: 'July 15, 2025'
    },
    'USR-003': {
      id: 'USR-003',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      department: 'hr',
      role: 'manager',
      employeeId: 'EMP-2024-003',
      status: 'inactive',
      createdAt: 'March 10, 2024',
      lastLogin: 'July 10, 2025 at 9:20 AM',
      updatedAt: 'July 10, 2025'
    },
    'USR-004': {
      id: 'USR-004',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      department: 'it',
      role: 'engineer',
      employeeId: 'EMP-2024-004',
      status: 'active',
      createdAt: 'April 5, 2024',
      lastLogin: 'July 17, 2025 at 8:45 AM',
      updatedAt: 'July 16, 2025'
    },
    'USR-005': {
      id: 'USR-005',
      firstName: 'Lisa',
      lastName: 'Thompson',
      email: 'lisa.thompson@company.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face',
      department: 'marketing',
      role: 'specialist',
      employeeId: 'EMP-2024-005',
      status: 'pending',
      createdAt: 'May 12, 2024',
      lastLogin: 'Never',
      updatedAt: 'July 15, 2025'
    },
    'USR-006': {
      id: 'USR-006',
      firstName: 'David',
      lastName: 'Kumar',
      email: 'david.kumar@company.com',
      phone: '+1 (555) 678-9012',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      department: 'operations',
      role: 'manager',
      employeeId: 'EMP-2024-006',
      status: 'active',
      createdAt: 'June 18, 2024',
      lastLogin: 'July 16, 2025 at 4:30 PM',
      updatedAt: 'July 16, 2025'
    }
  };

  // Mock habilitations data
  const mockHabilitations = [
    {
      id: 'HAB-001',
      name: 'Security Clearance Level 2',
      category: 'Security',
      status: 'active',
      acquisitionDate: '2024-01-15',
      expirationDate: '2025-01-15',
      priority: 'high'
    },
    {
      id: 'HAB-002',
      name: 'AWS Solutions Architect',
      category: 'Cloud Computing',
      status: 'active',
      acquisitionDate: '2024-03-10',
      expirationDate: '2025-03-10',
      priority: 'medium'
    },
    {
      id: 'HAB-003',
      name: 'CISSP Certification',
      category: 'Cybersecurity',
      status: 'expired',
      acquisitionDate: '2023-06-20',
      expirationDate: '2024-06-20',
      priority: 'high'
    },
    {
      id: 'HAB-004',
      name: 'Project Management Professional',
      category: 'Management',
      status: 'pending',
      acquisitionDate: '2024-07-01',
      expirationDate: '2027-07-01',
      priority: 'low'
    }
  ];

  // Mock permissions data
  const mockPermissions = [
    {
      id: 'system-admin',
      name: 'System Administration',
      icon: 'Settings',
      description: 'Core system administration and configuration permissions',
      permissions: [
        {
          id: 'user-management',
          name: 'User Management',
          description: 'Create, edit, and delete user accounts',
          type: 'admin',
          granted: true,
          risk: 'high'
        },
        {
          id: 'system-config',
          name: 'System Configuration',
          description: 'Modify system settings and configurations',
          type: 'admin',
          granted: false,
          risk: 'high'
        },
        {
          id: 'backup-restore',
          name: 'Backup & Restore',
          description: 'Perform system backups and restore operations',
          type: 'admin',
          granted: true,
          risk: 'medium'
        }
      ]
    },
    {
      id: 'data-access',
      name: 'Data Access',
      icon: 'Database',
      description: 'Permissions for accessing and managing data',
      permissions: [
        {
          id: 'read-sensitive',
          name: 'Read Sensitive Data',
          description: 'Access to classified and sensitive information',
          type: 'read',
          granted: true,
          risk: 'high'
        },
        {
          id: 'modify-records',
          name: 'Modify Records',
          description: 'Edit and update database records',
          type: 'write',
          granted: true,
          risk: 'medium'
        },
        {
          id: 'delete-records',
          name: 'Delete Records',
          description: 'Permanently delete database records',
          type: 'delete',
          granted: false,
          risk: 'high'
        }
      ]
    },
    {
      id: 'reporting',
      name: 'Reporting & Analytics',
      icon: 'BarChart3',
      description: 'Generate reports and access analytics',
      permissions: [
        {
          id: 'view-reports',
          name: 'View Reports',
          description: 'Access to standard system reports',
          type: 'read',
          granted: true,
          risk: 'low'
        },
        {
          id: 'create-reports',
          name: 'Create Reports',
          description: 'Generate custom reports and dashboards',
          type: 'write',
          granted: true,
          risk: 'low'
        },
        {
          id: 'export-data',
          name: 'Export Data',
          description: 'Export data in various formats',
          type: 'read',
          granted: false,
          risk: 'medium'
        }
      ]
    }
  ];

  // Mock activity logs
  const mockActivities = [
    {
      id: 'ACT-001',
      type: 'login',
      action: 'User Login',
      details: 'Successful login from desktop application',
      timestamp: '2025-07-17T10:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/91.0 Windows',
      success: true,
      severity: 'low'
    },
    {
      id: 'ACT-002',
      type: 'permission',
      action: 'Permission Modified',
      details: 'Data export permission revoked by administrator',
      timestamp: '2025-07-16T14:15:00Z',
      ipAddress: '192.168.1.50',
      userAgent: 'Firefox/89.0 Windows',
      success: true,
      severity: 'medium',
      metadata: {
        permission: 'export-data',
        previousValue: true,
        newValue: false,
        modifiedBy: 'admin@company.com'
      }
    },
    {
      id: 'ACT-003',
      type: 'habilitation',
      action: 'Habilitation Renewed',
      details: 'AWS Solutions Architect certification renewed',
      timestamp: '2025-07-15T09:00:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/91.0 Windows',
      success: true,
      severity: 'low'
    },
    {
      id: 'ACT-004',
      type: 'error',
      action: 'Failed Login Attempt',
      details: 'Multiple failed login attempts detected',
      timestamp: '2025-07-14T16:45:00Z',
      ipAddress: '203.0.113.1',
      userAgent: 'Unknown',
      success: false,
      severity: 'high'
    },
    {
      id: 'ACT-005',
      type: 'profile',
      action: 'Profile Updated',
      details: 'Phone number and department information updated',
      timestamp: '2025-07-13T11:20:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/91.0 Windows',
      success: true,
      severity: 'low'
    }
  ];

  // Mock documents
  const mockDocuments = [
    {
      id: 'DOC-001',
      name: 'Security_Clearance_Certificate.pdf',
      type: 'pdf',
      size: 2048576,
      category: 'certificate',
      description: 'Official security clearance level 2 certificate',
      uploadedAt: '2024-01-15T10:00:00Z',
      tags: ['security', 'clearance', 'official']
    },
    {
      id: 'DOC-002',
      name: 'AWS_Solutions_Architect_Certificate.pdf',
      type: 'pdf',
      size: 1536000,
      category: 'certificate',
      description: 'AWS Solutions Architect Professional certification',
      uploadedAt: '2024-03-10T14:30:00Z',
      tags: ['aws', 'cloud', 'certification']
    },
    {
      id: 'DOC-003',
      name: 'Performance_Review_2024.docx',
      type: 'docx',
      size: 512000,
      category: 'report',
      description: 'Annual performance review document',
      uploadedAt: '2024-12-15T09:15:00Z',
      tags: ['performance', 'review', 'annual']
    },
    {
      id: 'DOC-004',
      name: 'Training_Completion_Records.zip',
      type: 'zip',
      size: 4096000,
      category: 'training',
      description: 'Compressed archive of training completion certificates',
      uploadedAt: '2024-06-20T16:45:00Z',
      tags: ['training', 'certificates', 'archive']
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'habilitations', label: 'Habilitations', icon: 'Shield' },
    { id: 'permissions', label: 'Permissions', icon: 'Key' },
    { id: 'activity', label: 'Activity Logs', icon: 'Activity' },
    { id: 'documents', label: 'Documents', icon: 'FileText' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Get user data based on userId parameter
      const userData = mockUsers[userId] || mockUsers['USR-001'];
      setSelectedUser(userData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId]);

  const handleUpdateUser = (updatedUser) => {
    setSelectedUser(updatedUser);
    // In real app, make API call to update user
    console.log('Updating user:', updatedUser);
  };

  const handleAssignHabilitation = () => {
    // In real app, open modal or navigate to assignment page
    console.log('Assigning new habilitation');
  };

  const handleRevokeHabilitation = (habilitationId) => {
    // In real app, make API call to revoke habilitation
    console.log('Revoking habilitation:', habilitationId);
  };

  const handleUpdatePermissions = (updatedPermissions) => {
    // In real app, make API call to update permissions
    console.log('Updating permissions:', updatedPermissions);
  };

  const handleUploadDocument = (file) => {
    // In real app, upload file to server
    console.log('Uploading document:', file.name);
  };

  const handleDeleteDocument = (documentId) => {
    // In real app, make API call to delete document
    console.log('Deleting document:', documentId);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Users', path: '/users-list', icon: 'Users' },
    { 
      label: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'User Profile', 
      path: `/user-profile-management/${userId}`, 
      icon: 'User',
      current: true 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="lg:ml-64 pt-16">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading user profile...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Profile Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage user account, habilitations, and permissions
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => window.history.back()}
              >
                Back to Users
              </Button>
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth
                      ${activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }
                    `}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && (
              <UserProfileCard
                user={selectedUser}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {activeTab === 'habilitations' && (
              <HabilitationHistoryTable
                habilitations={mockHabilitations}
                onAssignHabilitation={handleAssignHabilitation}
                onRevokeHabilitation={handleRevokeHabilitation}
              />
            )}

            {activeTab === 'permissions' && (
              <PermissionsMatrix
                permissions={mockPermissions}
                onUpdatePermissions={handleUpdatePermissions}
              />
            )}

            {activeTab === 'activity' && (
              <ActivityLogs activities={mockActivities} />
            )}

            {activeTab === 'documents' && (
              <DocumentAttachments
                documents={mockDocuments}
                onUploadDocument={handleUploadDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfileManagement;