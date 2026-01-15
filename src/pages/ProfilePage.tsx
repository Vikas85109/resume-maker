import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiSave, FiX, FiFileText } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useResume } from '@/context/ResumeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { resumeData } = useResume();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    setIsSaving(true);
    const result = await updateProfile({ name: name.trim() });
    setIsSaving(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const hasResumeData = resumeData.personalInfo.fullName || resumeData.experience.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
            <p className="text-slate-500 mt-2">Manage your profile and resume</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">{user?.name}</h2>
                      <p className="text-indigo-100">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Name Field */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-slate-500">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">{user?.name}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiMail className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-slate-500">Email Address</label>
                        <p className="text-slate-900 font-medium">{user?.email}</p>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiCalendar className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-slate-500">Member Since</label>
                        <p className="text-slate-900 font-medium">
                          {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <FiSave className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Status Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">My Resume</h3>
                </div>

                {hasResumeData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <p className="text-green-700 font-medium">Resume Created</p>
                      <p className="text-sm text-green-600 mt-1">
                        {resumeData.personalInfo.fullName || 'Untitled Resume'}
                      </p>
                    </div>
                    <div className="text-sm text-slate-500 space-y-1">
                      <p>{resumeData.experience.length} Experience entries</p>
                      <p>{resumeData.education.length} Education entries</p>
                      <p>{resumeData.skills.length} Skills listed</p>
                    </div>
                    <Link
                      to="/editor"
                      className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-medium rounded-xl transition-colors"
                    >
                      Edit Resume
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-600">No resume yet</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Start building your professional resume
                      </p>
                    </div>
                    <Link
                      to="/templates"
                      className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-medium rounded-xl transition-colors"
                    >
                      Create Resume
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
