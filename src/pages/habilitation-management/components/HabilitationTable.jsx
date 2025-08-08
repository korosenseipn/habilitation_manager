import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import StatusBadge from './StatusBadge';
import HabilitationModal from './HabilitationModal';

const HabilitationTable = ({ 
  habilitations, 
  selectedItems, 
  onSelectionChange, 
  onEdit, 
  onDelete,
  sortConfig,
  onSort,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedHabilitation, setSelectedHabilitation] = useState(null);

  const columns = [
    { key: 'select', label: '', width: '50px', sortable: false },
    { key: 'userName', label: 'User Name', width: '200px', sortable: true },
    { key: 'certificationType', label: 'Reference', width: '180px', sortable: true },
    { key: 'status', label: 'Status', width: '120px', sortable: true },
    { key: 'issueDate', label: 'Issue Date', width: '130px', sortable: true },
    { key: 'expirationDate', label: 'Expiration Date', width: '130px', sortable: true },
    { key: 'department', label: 'Department', width: '150px', sortable: true },
    { key: 'actions', label: 'Actions', width: '120px', sortable: false }
  ];

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return habilitations.slice(startIndex, startIndex + itemsPerPage);
  }, [habilitations, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(habilitations.length / itemsPerPage);

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = paginatedData.map(item => item.id);
      onSelectionChange([...new Set([...selectedItems, ...allIds])]);
    } else {
      const currentPageIds = paginatedData.map(item => item.id);
      onSelectionChange(selectedItems.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      onSelectionChange([...selectedItems, id]);
    } else {
      onSelectionChange(selectedItems.filter(item => item !== id));
    }
  };

  const handleSort = (key) => {
    if (columns.find(col => col.key === key)?.sortable) {
      onSort(key);
    }
  };

  const handleView = (habilitation) => {
    setSelectedHabilitation(habilitation);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (habilitation) => {
    setSelectedHabilitation(habilitation);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDelete = (habilitation) => {
    if (window.confirm(`Are you sure you want to delete the habilitation for ${habilitation.userName}?`)) {
      onDelete(habilitation.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isAllSelected = paginatedData.length > 0 && 
    paginatedData.every(item => selectedItems.includes(item.id));
  const isIndeterminate = paginatedData.some(item => selectedItems.includes(item.id)) && !isAllSelected;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-muted-foreground ${
                    column.sortable ? 'cursor-pointer hover:text-foreground' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    {column.key === 'select' ? (
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    ) : (
                      <>
                        <span>{column.label}</span>
                        {column.sortable && (
                          <Icon
                            name={getSortIcon(column.key)}
                            size={14}
                            className="text-muted-foreground"
                          />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((habilitation) => (
              <tr key={habilitation.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedItems.includes(habilitation.id)}
                    onChange={(e) => handleSelectItem(habilitation.id, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{habilitation.userName}</p>
                      <p className="text-sm text-muted-foreground">{habilitation.userEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground">{habilitation.certificationType}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={habilitation.status} />
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {formatDate(habilitation.issueDate)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {formatDate(habilitation.expirationDate)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {habilitation.department}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(habilitation)}
                      className="h-8 w-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(habilitation)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {paginatedData.map((habilitation) => (
          <div key={habilitation.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedItems.includes(habilitation.id)}
                  onChange={(e) => handleSelectItem(habilitation.id, e.target.checked)}
                />
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{habilitation.userName}</p>
                  <p className="text-sm text-muted-foreground">{habilitation.userEmail}</p>
                </div>
              </div>
              <StatusBadge status={habilitation.status} />
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Certification:</span>
                <span className="text-sm font-medium text-foreground">{habilitation.certificationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Department:</span>
                <span className="text-sm text-foreground">{habilitation.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Issue Date:</span>
                <span className="text-sm text-foreground">{formatDate(habilitation.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Expiration:</span>
                <span className="text-sm text-foreground">{formatDate(habilitation.expirationDate)}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(habilitation)}
                iconName="Eye"
                iconPosition="left"
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(habilitation)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit
              </Button>
              
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-border rounded px-2 py-1 text-sm bg-background"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, habilitations.length)} of {habilitations.length}
            </span>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <HabilitationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        habilitation={selectedHabilitation}
        onSave={(data) => {
          if (modalMode === 'edit') {
            onEdit(selectedHabilitation.id, data);
          }
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default HabilitationTable;