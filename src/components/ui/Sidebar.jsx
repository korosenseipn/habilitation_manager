import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'System overview and metrics'
    },
    {
      label: 'Habilitations',
      path: '/habilitation-management',
      icon: 'Shield',
      description: 'Certification management'
    },
    {
      label: 'Users',
      path: '/users-list',
      icon: 'Users',
      description: 'User account management'
    },
    {
      label: 'Reports',
      path: '/compliance-reporting',
      icon: 'FileText',
      description: 'Compliance and analytics'
    },
    {
      label: 'Notifications',
      path: '/notifications-alerts',
      icon: 'Bell',
      description: 'Alerts and communications'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-mobile-nav lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border z-sidebar
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-card-foreground">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = isActivePath(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left
                    transition-smooth group
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-card-foreground hover:bg-muted hover:text-card-foreground'
                    }
                  `}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    className={`
                      ${isActive 
                        ? 'text-primary-foreground' 
                        : 'text-muted-foreground group-hover:text-card-foreground'
                      }
                    `}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`
                      font-medium text-sm
                      ${isActive ? 'text-primary-foreground' : ''}
                    `}>
                      {item.label}
                    </p>
                    <p className={`
                      text-xs mt-0.5
                      ${isActive 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground group-hover:text-muted-foreground'
                      }
                    `}>
                      {item.description}
                    </p>
                  </div>
                  
                  {isActive && (
                    <div className="w-1 h-6 bg-primary-foreground rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-card-foreground">System Status</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-muted-foreground">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;