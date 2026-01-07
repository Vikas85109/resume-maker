import React, { useState, useEffect } from 'react';
import { adminApi } from '@/context/AdminContext';

interface EmailTemplate {
  id: number;
  name: string;
  slug: string;
  subject: string;
  body: string;
  variables: string | null;
  is_active: boolean;
  created_at: string;
}

interface EmailLog {
  id: number;
  to_email: string;
  subject: string;
  status: 'sent' | 'pending' | 'failed';
  template_name: string | null;
  user_name: string | null;
  created_at: string;
  error_message: string | null;
}

interface EmailStats {
  overview: {
    total: number;
    sent: number;
    pending: number;
    failed: number;
  };
  byDay: { date: string; count: number; status: string }[];
  byTemplate: { name: string; count: number }[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const AdminEmail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'logs' | 'send'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Template form
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    slug: '',
    subject: '',
    body: '',
    variables: ''
  });

  // Send email form
  const [sendForm, setSendForm] = useState({
    toEmail: '',
    templateId: '',
    subject: '',
    body: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (activeTab === 'templates') {
      fetchTemplates();
    } else if (activeTab === 'logs') {
      fetchLogs();
    }
    fetchStats();
  }, [activeTab, pagination.page]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await adminApi('/admin/email/templates');
      if (response.success) {
        setTemplates(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      const response = await adminApi(`/admin/email/logs?${params}`);
      if (response.success) {
        setLogs(response.data.logs || []);
        setPagination(response.data.pagination || pagination);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminApi('/admin/email/stats');
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const url = editingTemplate
        ? `/admin/email/templates/${editingTemplate.id}`
        : '/admin/email/templates';
      const method = editingTemplate ? 'PUT' : 'POST';

      const response = await adminApi(url, {
        method,
        body: JSON.stringify({
          ...templateForm,
          variables: templateForm.variables ? templateForm.variables.split(',').map(v => v.trim()) : null
        })
      });

      if (response.success) {
        setShowTemplateModal(false);
        setEditingTemplate(null);
        resetTemplateForm();
        fetchTemplates();
      }
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await adminApi(`/admin/email/templates/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleSendTestEmail = async () => {
    if (!sendForm.toEmail) {
      alert('Please enter an email address');
      return;
    }

    setSending(true);
    try {
      const response = await adminApi('/admin/email/test', {
        method: 'POST',
        body: JSON.stringify({
          toEmail: sendForm.toEmail,
          templateId: sendForm.templateId || undefined,
          subject: sendForm.subject || undefined,
          body: sendForm.body || undefined
        })
      });

      if (response.success) {
        alert('Test email sent successfully!');
        fetchLogs();
        fetchStats();
      } else {
        alert(response.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      slug: '',
      subject: '',
      body: '',
      variables: ''
    });
  };

  const openEditTemplateModal = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      slug: template.slug,
      subject: template.subject,
      body: template.body,
      variables: template.variables ? JSON.parse(template.variables).join(', ') : ''
    });
    setShowTemplateModal(true);
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

  const getStatusBadge = (status: string) => {
    const styles = {
      sent: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Email Management</h1>
        <p className="text-slate-500">Manage email templates and send communications</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-slate-500">Total Emails</p>
            <p className="text-2xl font-bold text-slate-800">{stats.overview.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-slate-500">Sent</p>
            <p className="text-2xl font-bold text-green-600">{stats.overview.sent}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.overview.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-slate-500">Failed</p>
            <p className="text-2xl font-bold text-red-600">{stats.overview.failed}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-slate-200">
          <nav className="flex">
            {(['templates', 'logs', 'send'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'templates' && 'Templates'}
                {tab === 'logs' && 'Email Logs'}
                {tab === 'send' && 'Send Email'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800">Email Templates</h3>
                <button
                  onClick={() => {
                    setEditingTemplate(null);
                    resetTemplateForm();
                    setShowTemplateModal(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Template
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-slate-800">{template.name}</h4>
                          <p className="text-sm text-slate-500">Slug: {template.slug}</p>
                          <p className="text-sm text-slate-600 mt-1">Subject: {template.subject}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditTemplateModal(template)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {templates.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No email templates found</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">To</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Subject</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <p className="text-sm text-slate-800">{log.to_email}</p>
                              {log.user_name && (
                                <p className="text-xs text-slate-500">{log.user_name}</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm text-slate-800">{log.subject}</p>
                              {log.template_name && (
                                <p className="text-xs text-slate-500">Template: {log.template_name}</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(log.status)}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">{formatDate(log.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {logs.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No email logs found</p>
                  )}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-500">
                        Page {pagination.page} of {pagination.totalPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={pagination.page === 1}
                          className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={pagination.page === pagination.totalPages}
                          className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Send Email Tab */}
          {activeTab === 'send' && (
            <div className="max-w-xl">
              <h3 className="font-semibold text-slate-800 mb-4">Send Test Email</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">To Email</label>
                  <input
                    type="email"
                    value={sendForm.toEmail}
                    onChange={(e) => setSendForm({ ...sendForm, toEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="recipient@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Template (optional)</label>
                  <select
                    value={sendForm.templateId}
                    onChange={(e) => setSendForm({ ...sendForm, templateId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Custom Email</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>

                {!sendForm.templateId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                      <input
                        type="text"
                        value={sendForm.subject}
                        onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Email subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Body (HTML)</label>
                      <textarea
                        value={sendForm.body}
                        onChange={(e) => setSendForm({ ...sendForm, body: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={6}
                        placeholder="<p>Your email content here...</p>"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={handleSendTestEmail}
                  disabled={sending || !sendForm.toEmail}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Test Email
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowTemplateModal(false)}></div>
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-lg font-semibold text-slate-800 mb-6">
                {editingTemplate ? 'Edit Template' : 'Create Template'}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Welcome Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={templateForm.slug}
                      onChange={(e) => setTemplateForm({ ...templateForm, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="welcome-email"
                      disabled={!!editingTemplate}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Welcome to ResumeBuilder, {{name}}!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Variables (comma-separated)</label>
                  <input
                    type="text"
                    value={templateForm.variables}
                    onChange={(e) => setTemplateForm({ ...templateForm, variables: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="name, email, link"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Body (HTML)</label>
                  <textarea
                    value={templateForm.body}
                    onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                    rows={12}
                    placeholder="<h1>Hello {{name}}</h1><p>Welcome to our platform!</p>"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveTemplate}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingTemplate ? 'Save Changes' : 'Create Template'}
                </button>
                <button
                  onClick={() => setShowTemplateModal(false)}
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

export default AdminEmail;
