import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const HabilitationHistoryTable = ({ habilitations, onAssignHabilitation, onRevokeHabilitation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('expirationDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'pending', label: 'Pending' },
    { value: 'revoked', label: 'Revoked' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'status', label: 'Status' },
    { value: 'acquisitionDate', label: 'Acquisition Date' },
    { value: 'expirationDate', label: 'Expiration Date' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'expired':
        return 'bg-error text-error-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'revoked':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredHabilitations = habilitations
    .filter(hab => {
      const matchesSearch = hab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hab.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || hab.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy.includes('Date')) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiration = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Habilitation History</h3>
            <p className="text-sm text-muted-foreground">
              Manage user certifications and authorizations
            </p>
          </div>
          
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={onAssignHabilitation}
          >
            Assign Habilitation
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search habilitations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
            className="w-full md:w-48"
          />
          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            className="w-full md:w-48"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Habilitation</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('acquisitionDate')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Acquired</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('expirationDate')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Expires</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Priority</th>
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHabilitations.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8">
                  <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No habilitations found</p>
                </td>
              </tr>
            ) : (
              filteredHabilitations.map((habilitation) => {
                const daysUntilExpiration = getDaysUntilExpiration(habilitation.expirationDate);
                
                return (
                  <tr key={habilitation.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{habilitation.name}</p>
                        <p className="text-sm text-muted-foreground">{habilitation.category}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(habilitation.status)}`}>
                        {habilitation.status.charAt(0).toUpperCase() + habilitation.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">
                        {formatDate(habilitation.acquisitionDate)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="text-sm text-foreground">
                          {formatDate(habilitation.expirationDate)}
                        </span>
                        {habilitation.status === 'active' && daysUntilExpiration <= 30 && (
                          <p className="text-xs text-warning mt-1">
                            {daysUntilExpiration > 0 ? `${daysUntilExpiration} days left` : 'Expired'}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-medium ${getPriorityColor(habilitation.priority)}`}>
                        {habilitation.priority.charAt(0).toUpperCase() + habilitation.priority.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          iconPosition="left"
                        >
                          View
                        </Button>
                        {habilitation.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="XCircle"
                            iconPosition="left"
                            onClick={() => onRevokeHabilitation(habilitation.id)}
                            className="text-error hover:text-error"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredHabilitations.length} of {habilitations.length} habilitations
          </span>
          <div className="flex items-center space-x-4">
            <span>Active: {habilitations.filter(h => h.status === 'active').length}</span>
            <span>Expired: {habilitations.filter(h => h.status === 'expired').length}</span>
            <span>Pending: {habilitations.filter(h => h.status === 'pending').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabilitationHistoryTable;