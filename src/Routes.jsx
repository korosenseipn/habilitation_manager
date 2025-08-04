import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Login from "pages/login";
import Dashboard from "pages/dashboard";
import NotificationsAlerts from "pages/notifications-alerts";
import ComplianceReporting from "pages/compliance-reporting";
import HabilitationManagement from "pages/habilitation-management";
import UsersList from "pages/users-list";
import UserProfileManagement from "pages/user-profile-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications-alerts" element={<NotificationsAlerts />} />
        <Route path="/compliance-reporting" element={<ComplianceReporting />} />
        <Route path="/habilitation-management" element={<HabilitationManagement />} />
        <Route path="/users-list" element={<UsersList />} />
        <Route path="/user-profile-management/:userId" element={<UserProfileManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;