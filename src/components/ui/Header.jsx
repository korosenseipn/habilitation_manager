"use client"

import { useState } from "react"
import Icon from "../AppIcon"
import Button from "./Button"
import { useNavigate } from "react-router-dom"

const Header = ({ onSidebarToggle, sidebarOpen }) => {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()

  // Get user email from localStorage for display
  const userEmail = localStorage.getItem("userEmail") || "admin@company.com"
  const userName = userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1)

  const notifications = [
    {
      id: 1,
      title: "Certification Expiring Soon",
      message: "John Doe's security clearance expires in 7 days",
      time: "2 hours ago",
      type: "warning",
      unread: true,
    },
    {
      id: 2,
      title: "New User Registration",
      message: "Sarah Wilson has requested access to Level 2 systems",
      time: "4 hours ago",
      type: "info",
      unread: true,
    },
    {
      id: 3,
      title: "Compliance Report Ready",
      message: "Monthly habilitation report has been generated",
      time: "1 day ago",
      type: "success",
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen)
    setProfileOpen(false)
  }

  const handleProfileClick = () => {
    setProfileOpen(!profileOpen)
    setNotificationOpen(false)
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
    setProfileOpen(false)
  }

  const handleLogoutConfirm = () => {
    // Clear authentication state from localStorage
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")

    // Clear any other user-related data if needed
    // localStorage.removeItem('userRole');
    // localStorage.removeItem('sessionToken');

    // Close confirmation dialog
    setShowLogoutConfirm(false)

    // Navigate to login page
    navigate("/login", { replace: true })
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-header">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left Section - Logo and Menu Toggle */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="lg:hidden">
              <Icon name="Menu" size={20} />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">Habilitations Manager System</h1>
              </div>
            </div>
          </div>

          {/* Right Section - Notifications and Profile */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={handleNotificationClick} className="relative">
                <Icon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-dropdown z-dropdown">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-medium text-popover-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border hover:bg-muted cursor-pointer transition-smooth ${
                          notification.unread ? "bg-accent/5" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === "warning"
                                ? "bg-warning"
                                : notification.type === "success"
                                  ? "bg-success"
                                  : "bg-accent"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-popover-foreground">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border">
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button variant="ghost" onClick={handleProfileClick} className="flex items-center space-x-2 px-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <span className="hidden md:block text-sm font-medium">{userName}</span>
                <Icon name="ChevronDown" size={16} />
              </Button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-dropdown z-dropdown">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm">
                      <p className="font-medium text-popover-foreground">{userName}</p>
                      <p className="text-muted-foreground">{userEmail}</p>
                    </div>
                    <div className="border-t border-border my-2"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      iconName="User"
                      iconPosition="left"
                    >
                      Profile Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      iconName="Settings"
                      iconPosition="left"
                    >
                      Preferences
                    </Button>
                    <div className="border-t border-border my-2"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-error hover:text-error"
                      iconName="LogOut"
                      iconPosition="left"
                      onClick={handleLogoutClick}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {(notificationOpen || profileOpen) && (
          <div
            className="fixed inset-0 bg-black/20 z-[999] lg:hidden"
            onClick={() => {
              setNotificationOpen(false)
              setProfileOpen(false)
            }}
          />
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="LogOut" size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Sign Out</h3>
                <p className="text-sm text-muted-foreground">Are you sure you want to sign out?</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              You will be redirected to the login page and will need to sign in again to access the system.
            </p>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleLogoutCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleLogoutConfirm}
                className="flex-1 bg-error hover:bg-error/90"
                iconName="LogOut"
                iconPosition="left"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
