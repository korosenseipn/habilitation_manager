import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';

const UsersList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    employeeId: ''
  });

  // Mock users data
  const mockUsers = [
    {
      id: 'USR-001',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c0b1a1?w=400&h=400&fit=crop&crop=face',
      department: 'IT',
      role: 'Senior Analyst',
      employeeId: 'EMP-2024-001',
      status: 'active',
      lastLogin: '2025-07-17T10:30:00Z',
      habilitationsCount: 4,
      activeHabilitations: 2
    },
    {
      id: 'USR-002',
      firstName: 'John',
      lastName: 'Davis',
      email: 'john.davis@company.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      department: 'Finance',
      role: 'Financial Analyst',
      employeeId: 'EMP-2024-002',
      status: 'active',
      lastLogin: '2025-07-16T14:15:00Z',
      habilitationsCount: 3,
      activeHabilitations: 3
    },
    {
      id: 'USR-003',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      department: 'HR',
      role: 'HR Manager',
      employeeId: 'EMP-2024-003',
      status: 'inactive',
      lastLogin: '2025-07-10T09:20:00Z',
      habilitationsCount: 2,
      activeHabilitations: 1
    },
    {
      id: 'USR-004',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      department: 'IT',
      role: 'DevOps Engineer',
      employeeId: 'EMP-2024-004',
      status: 'active',
      lastLogin: '2025-07-17T08:45:00Z',
      habilitationsCount: 5,
      activeHabilitations: 4
    },
    {
      id: 'USR-005',
      firstName: 'Lisa',
      lastName: 'Thompson',
      email: 'lisa.thompson@company.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face',
      department: 'Marketing',
      role: 'Marketing Specialist',
      employeeId: 'EMP-2024-005',
      status: 'pending',
      lastLogin: null,
      habilitationsCount: 1,
      activeHabilitations: 0
    },
    {
      id: 'USR-006',
      firstName: 'David',
      lastName: 'Kumar',
      email: 'david.kumar@company.com',
      phone: '+1 (555) 678-9012',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      department: 'Operations',
      role: 'Operations Manager',
      employeeId: 'EMP-2024-006',
      status: 'active',
      lastLogin: '2025-07-16T16:30:00Z',
      habilitationsCount: 6,
      activeHabilitations: 5
    }
  ];

  const departments = ['All', 'IT', 'Finance', 'HR', 'Marketing', 'Operations'];
  const statusOptions = ['All', 'Active', 'Inactive', 'Pending'];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Apply department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(user => user.department === departmentFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, departmentFilter, users]);

  const handleUserClick = (userId) => {
    navigate(`/user-profile-management/${userId}`);
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCloseModal = () => {
    setShowAddUserModal(false);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      employeeId: ''
    });
  };

  const handleInputChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    
    // Generate new user ID
    const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    
    // Create new user object
    const userToAdd = {
      ...newUser,
      id: newId,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      status: 'pending',
      lastLogin: null,
      habilitationsCount: 0,
      activeHabilitations: 0
    };

    // Add user to the list
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    
    // Close modal
    handleCloseModal();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'text-green-700 bg-green-100', label: 'Active' },
      inactive: { color: 'text-red-700 bg-red-100', label: 'Inactive' },
      pending: { color: 'text-yellow-700 bg-yellow-100', label: 'Pending' }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Never';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Users', path: '/users-list', icon: 'Users', current: true }
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
                <p className="text-muted-foreground">Loading users...</p>
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
              <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="UserPlus"
                iconPosition="left"
                onClick={handleAddUser}
              >
                Add User
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

          {/* Add User Modal */}
          {showAddUserModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-card-foreground">Add New User</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseModal}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                
                <form onSubmit={handleSubmitUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-1">
                        First Name
                      </label>
                      <Input
                        type="text"
                        value={newUser.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-1">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        value={newUser.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-1">
                        Department
                      </label>
                      <Select
                        value={newUser.department}
                        onValueChange={(value) => handleInputChange('department', value)}
                        placeholder="Select department"
                      >
                        <Select.Option value="IT">IT</Select.Option>
                        <Select.Option value="Finance">Finance</Select.Option>
                        <Select.Option value="HR">HR</Select.Option>
                        <Select.Option value="Marketing">Marketing</Select.Option>
                        <Select.Option value="Operations">Operations</Select.Option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-1">
                        Role
                      </label>
                      <Input
                        type="text"
                        value={newUser.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        placeholder="Enter role"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      Employee ID
                    </label>
                    <Input
                      type="text"
                      value={newUser.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      placeholder="Enter employee ID"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Add User
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Search Users
                </label>
                <Input
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  iconName="Search"
                  iconPosition="left"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Status
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  placeholder="Select status"
                >
                  {statusOptions.map((status) => (
                    <Select.Option key={status} value={status.toLowerCase()}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Department
                </label>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                  placeholder="Select department"
                >
                  {departments.map((dept) => (
                    <Select.Option key={dept} value={dept.toLowerCase()}>
                      {dept}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-card-foreground truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.role}
                    </p>
                  </div>
                  {getStatusBadge(user.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Mail" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Building" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{user.department}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Last login: {formatLastLogin(user.lastLogin)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Shield" size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {user.activeHabilitations}/{user.habilitationsCount} Active
                      </span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' ?'Try adjusting your filters or search term.' :'There are no users to display.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UsersList;