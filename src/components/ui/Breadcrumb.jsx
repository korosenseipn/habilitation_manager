import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Default breadcrumb mapping based on routes
  const routeMapping = {
    '/dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/habilitation-management': { label: 'Habilitations', icon: 'Shield' },
    '/user-profile-management': { label: 'Users', icon: 'Users' },
    '/compliance-reporting': { label: 'Reports', icon: 'FileText' },
    '/notifications-alerts': { label: 'Notifications', icon: 'Bell' }
  };

  // Generate breadcrumb items if not provided
  const breadcrumbItems = items.length > 0 ? items : (() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with Dashboard as home
    if (location.pathname !== '/dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard'
      });
    }

    // Add current page
    const currentRoute = routeMapping[location.pathname];
    if (currentRoute) {
      breadcrumbs.push({
        label: currentRoute.label,
        path: location.pathname,
        icon: currentRoute.icon,
        current: true
      });
    }

    return breadcrumbs;
  })();

  const handleNavigation = (path) => {
    if (path && path !== location.pathname) {
      navigate(path);
    }
  };

  // Don't render breadcrumb if only one item or on dashboard
  if (breadcrumbItems.length <= 1 && location.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path || index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          
          <div className="flex items-center space-x-1">
            {item.icon && (
              <Icon 
                name={item.icon} 
                size={16} 
                className={item.current ? 'text-foreground' : 'text-muted-foreground'} 
              />
            )}
            
            {item.current ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item.path)}
                className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Button>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;