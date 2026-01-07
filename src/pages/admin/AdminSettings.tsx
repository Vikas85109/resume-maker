import React, { useState, useEffect } from 'react';
import { adminApi } from '@/context/AdminContext';
import { useAdmin } from '@/context/AdminContext';

interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  category: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  status: string;
  created_at: string;
}

export const AdminSettings: React.FC = () => {
  const { admin } = useAdmin();
  const [activeTab, setActiveTab] = useState<'general' | 'admins' | 'activity'>('general');
  const [settings, setSettings] = useState<Setting[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin form
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  useEffect(() => {
    if (activeTab === 'general') {
      fetchSettings();
    } else if (activeTab === 'admins') {
      fetchAdmins();
    } else if (activeTab === 'activity') {
      fetchActivityLogs();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await adminApi('/admin/settings');
      if (response.success) {
        setSettings(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await adminApi('/admin/admins');
      if (response.success) {
        setAdmins(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const response = await adminApi('/admin/activity-logs?limit=50');
      if (response.success) {
        setActivityLogs(response.data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      const response = await adminApi(`/admin/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value })
      });
      if (response.success) {
        fetchSettings();
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminForm.name || !adminForm.email || !adminForm.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await adminApi('/admin/admins', {
        method: 'POST',
        body: JSON.stringify(adminForm)
      });
      if (response.success) {
        setShowAdminModal(false);
        setAdminForm({ name: '', email: '', password: '', role: 'admin' });
        fetchAdmins();
      } else {
        alert(response.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Failed to create admin:', error);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
      const response = await adminApi(`/admin/admins/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        fetchAdmins();
      } else {
        alert(response.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Failed to delete admin:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    const category = setting.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  const isSuperAdmin = admin?.role === 'superadmin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage application settings and admin users</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-slate-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              General Settings
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('admins')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'admins'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Admin Users
              </button>
            )}
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Activity Logs
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : Object.keys(groupedSettings).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(groupedSettings).map(([category, categorySettings]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-slate-800 capitalize mb-4">{category}</h3>
                      <div className="space-y-4">
                        {categorySettings.map((setting) => (
                          <div key={setting.id} className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                              <p className="font-medium text-slate-700">{setting.setting_key.replace(/_/g, ' ')}</p>
                            </div>
                            <div className="w-64">
                              <input
                                type="text"
                                defaultValue={setting.setting_value}
                                onBlur={(e) => {
                                  if (e.target.value !== setting.setting_value) {
                                    handleUpdateSetting(setting.setting_key, e.target.value);
                                  }
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                disabled={!isSuperAdmin}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">No settings configured</p>
              )}
            </div>
          )}

          {/* Admin Users Tab */}
          {activeTab === 'admins' && isSuperAdmin && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800">Admin Users</h3>
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Admin
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Created</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {admins.map((adminUser) => (
                        <tr key={adminUser.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium text-sm">
                                  {adminUser.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-slate-800">{adminUser.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{adminUser.email}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                adminUser.role === 'superadmin'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {adminUser.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{formatDate(adminUser.created_at)}</td>
                          <td className="px-4 py-3 text-right">
                            {adminUser.id !== admin?.id && (
                              <button
                                onClick={() => handleDeleteAdmin(adminUser.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {admins.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No admin users found</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Activity Logs Tab */}
          {activeTab === 'activity' && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 py-3 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800">
                          <span className="font-medium">{log.user_name || 'System'}</span>
                          {' '}<span className="text-slate-600">{log.action.replace(/_/g, ' ')}</span>
                          {log.entity_type && (
                            <span className="text-slate-500"> on {log.entity_type}</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(log.created_at)}</p>
                      </div>
                    </div>
                  ))}

                  {activityLogs.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No activity logs found</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowAdminModal(false)}></div>
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <button
                onClick={() => setShowAdminModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-lg font-semibold text-slate-800 mb-6">Add Admin User</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Admin Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Strong password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={adminForm.role}
                    onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleCreateAdmin}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Admin
                </button>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
