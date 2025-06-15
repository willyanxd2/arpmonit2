import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Network, 
  Activity, 
  Settings, 
  Bell,
  Shield,
  X,
  CheckCheck,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { 
    notifications, 
    showNotifications, 
    toggleNotifications, 
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications
  } = useApp();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Activity },
    { path: '/jobs', label: 'Jobs', icon: Network },
  ];

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
  };

  return (
    <div className="flex h-screen bg-dark-950">
      {/* Sidebar */}
      <div className="w-64 bg-dark-900 border-r border-dark-700">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ARP Monitor</h1>
              <p className="text-xs text-dark-400">Network Guardian</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-lg'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-dark-900 border-b border-dark-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {location.pathname === '/' && 'Dashboard Overview'}
                {location.pathname === '/jobs' && 'Job Management'}
                {location.pathname.startsWith('/jobs/') && 'Job Details'}
              </h2>
              <p className="text-sm text-dark-400">
                Real-time network monitoring and device tracking
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                >
                  <Bell className="w-5 h-5 text-dark-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-orange rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse-neon">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-96 bg-dark-900 border border-dark-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-dark-700 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-neon-orange hover:text-neon-orange/80 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={toggleNotifications}
                          className="text-dark-400 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 border-b border-dark-700 hover:bg-dark-800 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-dark-800/50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'warning' ? 'bg-neon-orange' : 'bg-neon-cyan'
                              } ${!notification.read ? 'animate-pulse' : ''}`}></div>
                              <div className="flex-1">
                                <p className="text-sm text-white">{notification.message}</p>
                                <p className="text-xs text-dark-400 mt-1">
                                  {notification.job_name} • {notification.mac_address}
                                </p>
                                <p className="text-xs text-dark-500 mt-1">
                                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-dark-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <Link 
                to="/settings"
                className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
              >
                <Settings className="w-5 h-5 text-dark-300" />
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-dark-950 p-6">
          {children}
        </main>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={toggleNotifications}
        ></div>
      )}
    </div>
  );
}

export default Layout;