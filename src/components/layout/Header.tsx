import React, { useState, useRef, useEffect } from 'react';
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import StepIndicator from '@/components/ui/StepIndicator';
import Button from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onDownload?: () => void;
  isDownloading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onDownload, isDownloading }) => {
  const { currentStep, goToTemplates } = useApp();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">
              Resume<span className="text-indigo-600">Builder</span>
            </span>
          </div>

          {/* Step Indicator */}
          <div className="hidden md:block">
            <StepIndicator currentStep={currentStep} onStepClick={goToTemplates} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {currentStep === 'editor' && onDownload && (
              <Button
                variant="primary"
                onClick={onDownload}
                isLoading={isDownloading}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
              >
                Download PDF
              </Button>
            )}

            {/* User Menu */}
            {user && (
              <>
                {/* User Info with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <FiChevronDown
                      className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <FiUser className="w-4 h-4 text-slate-400" />
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visible Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  leftIcon={<FiLogOut className="w-4 h-4" />}
                  className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
