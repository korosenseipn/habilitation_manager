import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ComplianceTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const complianceData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'IT',
      position: 'Senior Developer',
      totalCertifications: 5,
      compliantCertifications: 4,
      expiringCertifications: 1,
      status: 'expiring_soon',
      lastUpdated: '2025-07-15',
      complianceScore: 80
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      department: 'Security',
      position: 'Security Analyst',
      totalCertifications: 6,
      compliantCertifications: 6,
      expiringCertifications: 0,
      status: 'compliant',
      lastUpdated: '2025-07-16',
      complianceScore: 100
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      department: 'HR',
      position: 'HR Manager',
      totalCertifications: 4,
      compliantCertifications: 2,
      expiringCertifications: 0,
      status: 'non_compliant',
      lastUpdated: '2025-07-10',
      complianceScore: 50
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      department: 'Finance',
      position: 'Financial Analyst',
      totalCertifications: 3,
      compliantCertifications: 3,
      expiringCertifications: 0,
      status: 'compliant',
      lastUpdated: '2025-07-17',
      complianceScore: 100
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@company.com',
      department: 'Operations',
      position: 'Operations Manager',
      totalCertifications: 7,
      compliantCertifications: 5,
      expiringCertifications: 2,
      status: 'expiring_soon',
      lastUpdated: '2025-07-14',
      complianceScore: 71
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      department: 'Legal',
      position: 'Legal Counsel',
      totalCertifications: 4,
      compliantCertifications: 4,
      expiringCertifications: 0,
      status: 'compliant',
      lastUpdated: '2025-07-16',
      complianceScore: 100
    },
    {
      id: 7,
      name: 'Robert Taylor',
      email: 'robert.taylor@company.com',
      department: 'IT',
      position: 'System Administrator',
      totalCertifications: 8,
      compliantCertifications: 6,
      expiringCertifications: 1,
      status: 'expiring_soon',
      lastUpdated: '2025-07-13',
      complianceScore: 75
    },
    {
      id: 8,
      name: 'Jennifer White',
      email: 'jennifer.white@company.com',
      department: 'Security',
      position: 'Security Manager',
      totalCertifications: 9,
      compliantCertifications: 8,
      expiringCertifications: 1,
      status: 'expiring_soon',
      lastUpdated: '2025-07-15',
      complianceScore: 89
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'compliant', label: 'Compliant' },
    { value: 'non_compliant', label: 'Non-Compliant' },
    { value: 'expiring_soon', label: 'Expiring Soon' },
    { value: 'pending', label: 'Pending' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'Security', label: 'Security' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Legal', label: 'Legal & Compliance' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      compliant: { color: 'bg-success text-success-foreground', label: 'Compliant', icon: 'CheckCircle' },
      non_compliant: { color: 'bg-error text-error-foreground', label: 'Non-Compliant', icon: 'XCircle' },
      expiring_soon: { color: 'bg-warning text-warning-foreground', label: 'Expiring Soon', icon: 'Clock' },
      pending: { color: 'bg-accent text-accent-foreground', label: 'Pending', icon: 'Clock3' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  const getComplianceScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const filteredData = complianceData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || item.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    console.log('Exporting compliance data...');
  };

  const handleViewDetails = (userId) => {
    console.log('Viewing details for user:', userId);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Compliance Details</h2>
            <p className="text-sm text-muted-foreground">Individual user compliance status and metrics</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
          
          <Select
            options={departmentOptions}
            value={departmentFilter}
            onChange={setDepartmentFilter}
            placeholder="Filter by department"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Department</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Certifications</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Compliance Score</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Updated</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                <td className="p-4">
                  <div>
                    <p className="font-medium text-card-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.position}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-card-foreground">{user.department}</span>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-card-foreground">Total: {user.totalCertifications}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={12} className="text-success" />
                      <span className="text-xs text-muted-foreground">Compliant: {user.compliantCertifications}</span>
                    </div>
                    {user.expiringCertifications > 0 && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={12} className="text-warning" />
                        <span className="text-xs text-muted-foreground">Expiring: {user.expiringCertifications}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getComplianceScoreColor(user.complianceScore)}`}>
                      {user.complianceScore}%
                    </span>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          user.complianceScore >= 90 ? 'bg-success' :
                          user.complianceScore >= 70 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ width: `${user.complianceScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(user.status)}
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{user.lastUpdated}</span>
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(user.id)}
                    iconName="Eye"
                    iconPosition="left"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceTable;