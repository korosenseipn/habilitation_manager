import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DocumentAttachments = ({ documents, onUploadDocument, onDeleteDocument }) => {
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      onUploadDocument(file);
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return 'FileText';
      case 'doc': case'docx':
        return 'FileText';
      case 'jpg': case'jpeg': case'png': case'gif':
        return 'Image';
      case 'zip': case'rar':
        return 'Archive';
      default:
        return 'File';
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'text-error';
      case 'doc': case'docx':
        return 'text-primary';
      case 'jpg': case'jpeg': case'png': case'gif':
        return 'text-success';
      case 'zip': case'rar':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Document Attachments</h3>
            <p className="text-sm text-muted-foreground">
              Manage certificates, documents, and file attachments
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Download All
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="mt-4">
          <Input
            type="search"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Upload Area */}
      <div className="p-6 border-b border-border">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-smooth
            ${dragActive 
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar"
          />
          
          <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PDF, DOC, DOCX, images, and archives up to 10MB
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="divide-y divide-border">
        {filteredDocuments.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No documents uploaded</p>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <div key={document.id} className="p-4 hover:bg-muted/50 transition-smooth">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg bg-muted ${getFileTypeColor(document.type)}`}>
                  <Icon
                    name={getFileIcon(document.type)}
                    size={20}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {document.name}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {document.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(document.size)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(document.uploadedAt)}
                        </span>
                      </div>
                      
                      {document.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {document.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        iconPosition="left"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                        iconPosition="left"
                      >
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        iconPosition="left"
                        onClick={() => onDeleteDocument(document.id)}
                        className="text-error hover:text-error"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {document.tags && document.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mt-3">
                      {document.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredDocuments.length} documents ({formatFileSize(
              filteredDocuments.reduce((total, doc) => total + doc.size, 0)
            )} total)
          </span>
          <div className="flex items-center space-x-4">
            <span>Certificates: {documents.filter(d => d.category === 'certificate').length}</span>
            <span>Reports: {documents.filter(d => d.category === 'report').length}</span>
            <span>Other: {documents.filter(d => !['certificate', 'report'].includes(d.category)).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAttachments;