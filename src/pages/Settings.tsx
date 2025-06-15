import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Database, 
  Globe, 
  Clock, 
  Info,
  Server,
  HardDrive,
  Network,
  Shield
} from 'lucide-react';
import { api } from '../services/api';
import { format } from 'date-fns';

interface SystemInfo {
  arpScanAvailable: boolean;
  arpScanVersion: string | null;
  interfaces: string[];
  platform: string;
  arch: string;
}

interface AppSettings {
  timezone: string;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: string;
  notifications: {
    sound: boolean;
    desktop: boolean;
  };
}

function Settings() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    autoRefresh: true,
    refreshInterval: 30,
    theme: 'dark',
    notifications: {
      sound: false,
      desktop: false
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemInfo();
    loadSettings();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const response = await api.get('/network/system');
      setSystemInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch system info:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('arp-monitor-settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  };

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('arp-monitor-settings', JSON.stringify(newSettings));
  };

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings };
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      (newSettings as any)[parent][child] = value;
    } else {
      (newSettings as any)[key] = value;
    }
    saveSettings(newSettings);
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Application Settings</h1>
        <p className="text-dark-400 mt-1">Configure your ARP monitoring application</p>
      </div>

      {/* System Information */}
      <div className="bg-dark-900 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center space-x-3 mb-6">
          <Info className="w-5 h-5 text-neon-cyan" />
          <h2 className="text-lg font-semibold text-white">System Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Server className="w-4 h-4 text-neon-purple" />
              <div>
                <p className="text-sm text-dark-400">Platform</p>
                <p className="text-white">{systemInfo?.platform} ({systemInfo?.arch})</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-neon-green" />
              <div>
                <p className="text-sm text-dark-400">ARP Scanner</p>
                <p className="text-white">
                  {systemInfo?.arpScanAvailable ? 'Available' : 'Not Available'}
                  {systemInfo?.arpScanVersion && (
                    <span className="text-dark-400 ml-2">({systemInfo.arpScanVersion})</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Network className="w-4 h-4 text-neon-orange" />
              <div>
                <p className="text-sm text-dark-400">Network Interfaces</p>
                <p className="text-white">{systemInfo?.interfaces.length || 0} detected</p>
                <p className="text-xs text-dark-500">
                  {systemInfo?.interfaces.join(', ')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Database className="w-4 h-4 text-neon-cyan" />
              <div>
                <p className="text-sm text-dark-400">Database</p>
                <p className="text-white">SQLite (Local)</p>
                <p className="text-xs text-dark-500">
                  /opt/arp-monitoring/backend/database/arp_monitoring.db
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <HardDrive className="w-4 h-4 text-neon-purple" />
              <div>
                <p className="text-sm text-dark-400">Application Path</p>
                <p className="text-white">/opt/arp-monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-neon-green" />
              <div>
                <p className="text-sm text-dark-400">Current Time</p>
                <p className="text-white">{format(new Date(), 'PPP p')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Settings */}
      <div className="bg-dark-900 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="w-5 h-5 text-neon-purple" />
          <h2 className="text-lg font-semibold text-white">Application Settings</h2>
        </div>
        
        <div className="space-y-6">
          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full max-w-md px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <p className="text-xs text-dark-500 mt-1">
              Current time in selected timezone: {format(new Date(), 'PPP p')}
            </p>
          </div>

          {/* Auto Refresh */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={settings.autoRefresh}
                onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                className="w-4 h-4 text-neon-cyan bg-dark-800 border-dark-600 rounded focus:ring-neon-cyan"
              />
              <label htmlFor="autoRefresh" className="text-white font-medium">
                Auto Refresh Data
              </label>
            </div>
            
            {settings.autoRefresh && (
              <div className="ml-7">
                <label className="block text-sm text-dark-400 mb-1">
                  Refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  value={settings.refreshInterval}
                  onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                  className="w-32 px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
                  min="10"
                  max="300"
                />
              </div>
            )}
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-white font-medium mb-3">Notification Settings</h3>
            <div className="space-y-3 ml-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="notificationSound"
                  checked={settings.notifications.sound}
                  onChange={(e) => handleSettingChange('notifications.sound', e.target.checked)}
                  className="w-4 h-4 text-neon-cyan bg-dark-800 border-dark-600 rounded focus:ring-neon-cyan"
                />
                <label htmlFor="notificationSound" className="text-dark-300">
                  Play sound for notifications
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="desktopNotifications"
                  checked={settings.notifications.desktop}
                  onChange={(e) => handleSettingChange('notifications.desktop', e.target.checked)}
                  className="w-4 h-4 text-neon-cyan bg-dark-800 border-dark-600 rounded focus:ring-neon-cyan"
                />
                <label htmlFor="desktopNotifications" className="text-dark-300">
                  Show desktop notifications
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Information */}
      <div className="bg-dark-900 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="w-5 h-5 text-neon-green" />
          <h2 className="text-lg font-semibold text-white">API Information</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-dark-400">Backend API Endpoint</p>
            <p className="text-white font-mono">http://localhost:3001/api</p>
          </div>
          
          <div>
            <p className="text-sm text-dark-400">Health Check</p>
            <p className="text-white font-mono">http://localhost:3001/api/health</p>
          </div>
          
          <div>
            <p className="text-sm text-dark-400">Frontend URL</p>
            <p className="text-white font-mono">http://localhost:5173</p>
          </div>
        </div>
      </div>

      {/* Version Information */}
      <div className="bg-dark-900 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center space-x-3 mb-6">
          <Info className="w-5 h-5 text-neon-orange" />
          <h2 className="text-lg font-semibold text-white">Version Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-dark-400">Application Version</p>
            <p className="text-white">1.0.0</p>
          </div>
          
          <div>
            <p className="text-sm text-dark-400">Build Date</p>
            <p className="text-white">{format(new Date(), 'PPP')}</p>
          </div>
          
          <div>
            <p className="text-sm text-dark-400">Environment</p>
            <p className="text-white">Development</p>
          </div>
          
          <div>
            <p className="text-sm text-dark-400">Node.js Version</p>
            <p className="text-white">18+</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;