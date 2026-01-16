import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUser, FiMail, FiCalendar, FiEdit2, FiSave, FiX, FiFileText,
  FiDownload, FiEye, FiBriefcase, FiBook, FiCode, FiAward,
  FiChevronRight, FiPlus, FiSettings
} from 'react-icons/fi';
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

  const stats = [
    { label: 'Experience', value: resumeData.experience.length, icon: FiBriefcase, color: 'from-blue-500 to-cyan-500' },
    { label: 'Education', value: resumeData.education.length, icon: FiBook, color: 'from-purple-500 to-pink-500' },
    { label: 'Skills', value: resumeData.skills.length, icon: FiCode, color: 'from-orange-500 to-red-500' },
    { label: 'Projects', value: resumeData.projects.length, icon: FiAward, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center ring-4 ring-white/30 shadow-2xl">
                <span className="text-5xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-indigo-600 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">{user?.name}</h1>
              <p className="text-indigo-200 text-lg mb-4">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20">
                  <FiCalendar className="w-4 h-4" />
                  Joined {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm text-green-100 text-sm rounded-full border border-green-400/30">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Active Account
                </span>
              </div>
            </div>

            {/* Quick Action */}
            <div className="md:ml-auto">
              <Link
                to="/editor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <FiEdit2 className="w-5 h-5" />
                Edit Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-100 group hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {message.type === 'success' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <FiX className="w-5 h-5" />
                )}
              </div>
              {message.text}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Profile Information</h3>
                      <p className="text-sm text-slate-500">Manage your personal details</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors font-medium"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {/* Name Field */}
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full mt-2 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg"
                          placeholder="Enter your name"
                        />
                      ) : (
                        <p className="text-xl font-semibold text-slate-900 mt-1">{user?.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FiMail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
                      <p className="text-xl font-semibold text-slate-900 mt-1">{user?.email}</p>
                      <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FiCalendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Member Since</label>
                      <p className="text-xl font-semibold text-slate-900 mt-1">
                        {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                      >
                        <FiX className="w-5 h-5" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        {isSaving ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <FiSave className="w-5 h-5" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                </div>
                <div className="p-4 grid sm:grid-cols-2 gap-3">
                  <Link
                    to="/templates"
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <FiPlus className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">New Resume</p>
                      <p className="text-sm text-slate-500">Start from a template</p>
                    </div>
                    <FiChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </Link>
                  <Link
                    to="/editor"
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-green-200 hover:bg-green-50/50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <FiDownload className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Download PDF</p>
                      <p className="text-sm text-slate-500">Export your resume</p>
                    </div>
                    <FiChevronRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Resume Status */}
            <div className="space-y-6">
              {/* Resume Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <FiFileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">My Resume</h3>
                      <p className="text-indigo-200 text-sm">Your career document</p>
                    </div>
                  </div>

                  {hasResumeData ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="font-medium">{resumeData.personalInfo.fullName || 'Untitled Resume'}</p>
                      <p className="text-indigo-200 text-sm mt-1">
                        {resumeData.personalInfo.jobTitle || 'No title set'}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="font-medium">No resume yet</p>
                      <p className="text-indigo-200 text-sm mt-1">Create your first resume</p>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {hasResumeData ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Completion</span>
                          <span className="font-medium text-slate-900">
                            {Math.min(100, Math.round(
                              ((resumeData.personalInfo.fullName ? 1 : 0) +
                              (resumeData.summary ? 1 : 0) +
                              (resumeData.experience.length > 0 ? 1 : 0) +
                              (resumeData.education.length > 0 ? 1 : 0) +
                              (resumeData.skills.length > 0 ? 1 : 0)) / 5 * 100
                            ))}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.round(
                                ((resumeData.personalInfo.fullName ? 1 : 0) +
                                (resumeData.summary ? 1 : 0) +
                                (resumeData.experience.length > 0 ? 1 : 0) +
                                (resumeData.education.length > 0 ? 1 : 0) +
                                (resumeData.skills.length > 0 ? 1 : 0)) / 5 * 100
                              ))}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-4 space-y-3">
                        <Link
                          to="/editor"
                          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
                        >
                          <FiEdit2 className="w-5 h-5" />
                          Edit Resume
                        </Link>
                        <Link
                          to="/editor"
                          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 font-medium rounded-xl transition-all"
                        >
                          <FiEye className="w-5 h-5" />
                          Preview
                        </Link>
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/templates"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      <FiPlus className="w-5 h-5" />
                      Create Resume
                    </Link>
                  )}
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-amber-900">Pro Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    Keep your resume to 1-2 pages
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    Use action verbs for impact
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    Quantify your achievements
                  </li>
                </ul>
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
