import React, { useState, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import HabilitationTable from './components/HabilitationTable';
import FilterPanel from './components/FilterPanel';
import BulkActions from './components/BulkActions';
import HabilitationModal from './components/HabilitationModal';

const HabilitationManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: '',
    certificationType: '',
    expirationFrom: '',
    expirationTo: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'userName', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Mock habilitations data
  const mockHabilitations = [
    {
      id: 1,
      userName: "John Doe",
      userEmail: "john.doe@company.com",
      certificationType: "Security Clearance Level 2",
      status: "active",
      issueDate: "2024-01-15",
      expirationDate: "2025-01-15",
      department: "IT",
      notes: "Regular security clearance for system administration tasks."
    },
    {
      id: 2,
      userName: "Sarah Wilson",
      userEmail: "sarah.wilson@company.com",
      certificationType: "Database Access",
      status: "expiring",
      issueDate: "2023-07-20",
      expirationDate: "2024-07-25",
      department: "Finance",
      notes: "Database access for financial reporting and analysis."
    },
    {
      id: 3,
      userName: "Mike Johnson",
      userEmail: "mike.johnson@company.com",
      certificationType: "Network Administrator",
      status: "expired",
      issueDate: "2023-03-10",
      expirationDate: "2024-03-10",
      department: "IT",
      notes: "Network administration privileges expired. Renewal required."
    },
    {
      id: 4,
      userName: "Emily Chen",
      userEmail: "emily.chen@company.com",
      certificationType: "Compliance Officer",
      status: "pending",
      issueDate: "2024-07-10",
      expirationDate: "2025-07-10",
      department: "Compliance",
      notes: "Pending approval for compliance officer certification."
    },
    {
      id: 5,
      userName: "David Brown",
      userEmail: "david.brown@company.com",
      certificationType: "Security Clearance Level 3",
      status: "active",
      issueDate: "2024-02-01",
      expirationDate: "2025-02-01",
      department: "Security",
      notes: "High-level security clearance for sensitive operations."
    },
    {
      id: 6,
      userName: "Lisa Garcia",
      userEmail: "lisa.garcia@company.com",
      certificationType: "System Administrator",
      status: "revoked",
      issueDate: "2023-11-15",
      expirationDate: "2024-11-15",
      department: "IT",
      notes: "Access revoked due to policy violation. Under review."
    },
    {
      id: 7,
      userName: "Robert Taylor",
      userEmail: "robert.taylor@company.com",
      certificationType: "Security Clearance Level 1",
      status: "active",
      issueDate: "2024-03-20",
      expirationDate: "2025-03-20",
      department: "Operations",
      notes: "Basic security clearance for operational tasks."
    },
    {
      id: 8,
      userName: "Jennifer Martinez",
      userEmail: "jennifer.martinez@company.com",
      certificationType: "Database Access",
      status: "expiring",
      issueDate: "2023-08-05",
      expirationDate: "2024-08-10",
      department: "HR",
      notes: "HR database access for employee management."
    },
    {
      id: 9,
      userName: "Kevin Anderson",
      userEmail: "kevin.anderson@company.com",
      certificationType: "Network Administrator",
      status: "active",
      issueDate: "2024-04-12",
      expirationDate: "2025-04-12",
      department: "IT",
      notes: "Network infrastructure management and maintenance."
    },
    {
      id: 10,
      userName: "Amanda White",
      userEmail: "amanda.white@company.com",
      certificationType: "Compliance Officer",
      status: "active",
      issueDate: "2024-01-30",
      expirationDate: "2025-01-30",
      department: "Legal",
      notes: "Legal compliance monitoring and reporting."
    }
  ];

  const [habilitations, setHabilitations] = useState(mockHabilitations);

  // Filter and sort habilitations
  const filteredAndSortedHabilitations = useMemo(() => {
    let filtered = [...habilitations];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.userName.toLowerCase().includes(searchTerm) ||
        item.userEmail.toLowerCase().includes(searchTerm) ||
        item.certificationType.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.department) {
      filtered = filtered.filter(item => item.department === filters.department);
    }

    if (filters.certificationType) {
      filtered = filtered.filter(item => item.certificationType === filters.certificationType);
    }

    if (filters.expirationFrom) {
      filtered = filtered.filter(item => new Date(item.expirationDate) >= new Date(filters.expirationFrom));
    }

    if (filters.expirationTo) {
      filtered = filtered.filter(item => new Date(item.expirationDate) <= new Date(filters.expirationTo));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'issueDate' || sortConfig.key === 'expirationDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [habilitations, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      department: '',
      certificationType: '',
      expirationFrom: '',
      expirationTo: ''
    });
    setCurrentPage(1);
  };

  const handleBulkAction = (action) => {
    console.log(`Executing bulk action: ${action} on items:`, selectedItems);
    
    switch (action) {
      case 'approve':
        setHabilitations(prev => prev.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: 'active' } : item
        ));
        break;
      case 'revoke':
        setHabilitations(prev => prev.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: 'revoked' } : item
        ));
        break;
      case 'extend':
        setHabilitations(prev => prev.map(item => {
          if (selectedItems.includes(item.id)) {
            const newExpirationDate = new Date(item.expirationDate);
            newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);
            return { ...item, expirationDate: newExpirationDate.toISOString().split('T')[0] };
          }
          return item;
        }));
        break;
      case 'export':
        const selectedData = habilitations.filter(item => selectedItems.includes(item.id));
        console.log('Exporting data:', selectedData);
        break;
      case 'delete':
        setHabilitations(prev => prev.filter(item => !selectedItems.includes(item.id)));
        break;
    }
    
    setSelectedItems([]);
  };

  const handleEdit = (id, updatedData) => {
    setHabilitations(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
  };

  const handleDelete = (id) => {
    setHabilitations(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleCreateHabilitation = (newHabilitation) => {
    const newId = Math.max(...habilitations.map(h => h.id)) + 1;
    setHabilitations(prev => [...prev, { ...newHabilitation, id: newId }]);
  };

  const getStatusCounts = () => {
    return habilitations.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Habilitation Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage user certifications and authorizations across your organization
              </p>
            </div>
            
            <Button
              variant="default"
              onClick={() => setCreateModalOpen(true)}
              iconName="Plus"
              iconPosition="left"
              className="lg:w-auto w-full"
            >
              Add New Habilitation
            </Button>
          </div>

          {/* Status Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">{habilitations.length}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-muted-foreground">Active</span>
              </div>
              <p className="text-2xl font-bold text-success mt-2">{statusCounts.active || 0}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
                <span className="text-sm font-medium text-muted-foreground">Expiring</span>
              </div>
              <p className="text-2xl font-bold text-warning mt-2">{statusCounts.expiring || 0}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="XCircle" size={20} className="text-error" />
                <span className="text-sm font-medium text-muted-foreground">Expired</span>
              </div>
              <p className="text-2xl font-bold text-error mt-2">{statusCounts.expired || 0}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={20} className="text-secondary" />
                <span className="text-sm font-medium text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold text-secondary mt-2">{statusCounts.pending || 0}</p>
            </div>
          </div>

          {/* Filters */}
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedCount={selectedItems.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedItems([])}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedHabilitations.length} of {habilitations.length} habilitations
            </p>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
              >
                Export All
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Habilitations Table */}
          <HabilitationTable
            habilitations={filteredAndSortedHabilitations}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          {/* Create Modal */}
          <HabilitationModal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            mode="create"
            onSave={handleCreateHabilitation}
          />
        </div>
      </main>
    </div>
  );
};

export default HabilitationManagement;