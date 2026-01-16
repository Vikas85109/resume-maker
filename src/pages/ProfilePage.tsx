import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar, FiEdit2, FiSave, FiFileText,
  FiDownload, FiEye, FiTrash2, FiClock, FiCreditCard, FiSettings,
  FiPlus, FiCamera, FiLock, FiCheck, FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useResume } from '@/context/ResumeContext';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { ISavedCV, IDraft, IInvoice } from '@/types/auth';

type TabType = 'cvs' | 'drafts' | 'invoices' | 'settings';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { resumeData } = useResume();
  const { selectedTemplate } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('cvs');

  // Profile editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Profile picture
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  const savedCVs: ISavedCV[] = resumeData.personalInfo.fullName ? [
    {
      id: '1',
      name: resumeData.personalInfo.fullName || 'My Resume',
      templateId: selectedTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ] : [];

  const drafts: IDraft[] = [];

  const invoices: IInvoice[] = [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }
    setIsSaving(true);
    const result = await updateProfile({ name: name.trim() });
    setIsSaving(false);
    if (result.success) {
      setMessage({ type: 'success', text: 'Name updated successfully' });
      setIsEditingName(false);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update name' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancelEditName = () => {
    setName(user?.name || '');
    setIsEditingName(false);
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsSaving(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(result.error || 'Failed to change password');
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = await updateProfile({ profilePicture: reader.result as string });
        if (result.success) {
          setMessage({ type: 'success', text: 'Profile picture updated' });
        }
        setTimeout(() => setMessage(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'cvs' as TabType, label: 'My CVs', icon: FiFileText, count: savedCVs.length },
    { id: 'drafts' as TabType, label: 'Drafts', icon: FiClock, count: drafts.length },
    { id: 'invoices' as TabType, label: 'Invoices', icon: FiCreditCard, count: invoices.length },
    { id: 'settings' as TabType, label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                onClick={handleProfilePictureClick}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-slate-200"
              >
                <FiCamera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <p className="text-slate-500 mt-1">{user?.email}</p>
              <p className="text-sm text-slate-400 mt-2">
                Member since {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
              </p>
            </div>

            {/* Quick Action */}
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              Create New CV
            </Link>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? <FiCheck className="w-5 h-5" /> : <FiAlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Tabs & Content */}
      <div className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* My CVs Tab */}
            {activeTab === 'cvs' && (
              <div>
                {savedCVs.length > 0 ? (
                  <div className="grid gap-4">
                    {savedCVs.map((cv) => (
                      <div
                        key={cv.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiFileText className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{cv.name}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                              Template: <span className="capitalize">{cv.templateId}</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Last updated {formatDate(cv.updatedAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              to="/editor"
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </Link>
                            <Link
                              to="/editor"
                              className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <FiEye className="w-5 h-5" />
                            </Link>
                            <Link
                              to="/editor"
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <FiDownload className="w-5 h-5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiFileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No CVs yet</h3>
                    <p className="text-slate-500 mb-6">Create your first professional CV to get started</p>
                    <Link
                      to="/templates"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Create CV
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Drafts Tab */}
            {activeTab === 'drafts' && (
              <div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <FiClock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Drafts expire after 30 days</p>
                      <p className="text-sm text-amber-600 mt-0.5">Save your drafts as CVs to keep them permanently</p>
                    </div>
                  </div>
                </div>

                {drafts.length > 0 ? (
                  <div className="grid gap-4">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiFileText className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{draft.name}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                              Created {formatDate(draft.createdAt)}
                            </p>
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              {getDaysRemaining(draft.expiresAt)} days remaining
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              Continue Editing
                            </button>
                            <button
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiClock className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No drafts</h3>
                    <p className="text-slate-500">Your in-progress CVs will appear here</p>
                  </div>
                )}
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div>
                {invoices.length > 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-slate-50">
                            <td className="px-5 py-4 text-sm text-slate-600">{formatDate(invoice.date)}</td>
                            <td className="px-5 py-4 text-sm text-slate-900">{invoice.description}</td>
                            <td className="px-5 py-4 text-sm font-medium text-slate-900">${invoice.amount.toFixed(2)}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                                invoice.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCreditCard className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No invoices</h3>
                    <p className="text-slate-500">Your billing history will appear here</p>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Profile Information</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Update your personal details</p>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                        {user?.profilePicture ? (
                          <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <button
                          onClick={handleProfilePictureClick}
                          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          Change Photo
                        </button>
                        {user?.profilePicture && (
                          <button
                            onClick={() => updateProfile({ profilePicture: '' })}
                            className="ml-2 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        )}
                        <p className="text-xs text-slate-400 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      {isEditingName ? (
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter your name"
                          />
                          <button
                            onClick={handleSaveName}
                            disabled={isSaving}
                            className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSaving ? (
                              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <FiSave className="w-4 h-4" />
                            )}
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditName}
                            className="px-4 py-2.5 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-900">{user?.name}</span>
                          <button
                            onClick={() => setIsEditingName(true)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900">{user?.email}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Verified
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Email address cannot be changed</p>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Password</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Manage your password</p>
                  </div>
                  <div className="p-6">
                    {showPasswordForm ? (
                      <div className="space-y-4 max-w-md">
                        {passwordError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                            <FiAlertCircle className="w-4 h-4" />
                            {passwordError}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleChangePassword}
                            disabled={isSaving}
                            className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSaving && (
                              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            )}
                            Update Password
                          </button>
                          <button
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPasswordError('');
                              setCurrentPassword('');
                              setNewPassword('');
                              setConfirmPassword('');
                            }}
                            className="px-4 py-2.5 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FiLock className="w-5 h-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">Password</p>
                            <p className="text-sm text-slate-500">••••••••••••</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          Change Password
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Account Information</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FiCalendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Member Since</p>
                          <p className="text-sm text-slate-500">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
