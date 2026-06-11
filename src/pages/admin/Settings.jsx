import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Calendar, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Key, 
  CheckCircle,
  Hash
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Profile data state
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Clipboard feedback
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Submission/Message states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [logoutCountdown, setLogoutCountdown] = useState(null);

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await adminService.getProfile();
        if (response.success) {
          setProfile(response.data);
        } else {
          setErrorMsg(response.message || 'Failed to retrieve admin profile.');
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        setErrorMsg(err.response?.data?.message || 'Error connecting to admin profile API.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle countdown before automatic logout
  useEffect(() => {
    if (logoutCountdown === null) return;
    if (logoutCountdown <= 0) {
      // Execute actual logout and redirect
      logout().then(() => {
        navigate('/admin/login');
      });
      return;
    }

    const timer = setTimeout(() => {
      setLogoutCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [logoutCountdown, logout, navigate]);

  // Copy to clipboard helper
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'id') {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    });
  };

  // Password validation checks
  const hasMinLength = newPassword.length >= 6;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const getStrengthPercent = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (hasMinLength) score += 33;
    if (hasNumber) score += 33;
    if (hasSpecial) score += 34;
    return score;
  };

  const getStrengthColor = () => {
    const score = getStrengthPercent();
    if (score <= 33) return 'bg-rose-500';
    if (score <= 66) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    const score = getStrengthPercent();
    if (!newPassword) return '';
    if (score <= 33) return 'Weak';
    if (score <= 66) return 'Medium';
    return 'Strong';
  };

  const handleResetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
  };

  // Submit Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword) {
      setErrorMsg('Current password is required.');
      return;
    }

    if (!hasMinLength) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('New password and password confirmation do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await adminService.changePassword(currentPassword, newPassword);
      if (response.success) {
        setSuccessMsg(response.message || 'Password changed successfully!');
        handleResetForm();
        setLogoutCountdown(3); // Start 3-second countdown to logout
      } else {
        setErrorMsg(response.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update credentials. Please check your current password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-xs max-w-5xl">
      {/* Header section with brand colors */}
      <div>
        <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
          Security Control Panel
        </span>
        <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
          Admin Profile & Security
        </h1>
        <p className="text-slate-500 text-[11px] mt-1">
          Manage your administrative profile information and update security credentials.
        </p>
      </div>

      {/* Success banner with real-time logout countdown */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900">Credentials Updated Successfully</p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">{successMsg}</p>
            </div>
          </div>
          {logoutCountdown !== null && (
            <div className="flex items-center gap-3 bg-white/60 border border-emerald-100 rounded-xl px-4 py-2 shrink-0 self-start md:self-auto shadow-sm">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="font-bold font-mono text-slate-800 text-[11px]">
                Automatic logout in <span className="text-emerald-600 text-xs font-black">{logoutCountdown}s</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl font-bold flex items-start gap-2.5 shadow-sm animate-shake">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-slate-900 font-extrabold">Security Check Failed</p>
            <p className="text-[10px] text-rose-600 font-medium mt-0.5">{errorMsg}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setErrorMsg('')} 
            className="text-rose-400 hover:text-rose-600 font-normal text-sm cursor-pointer px-1.5"
          >
            &times;
          </button>
        </div>
      )}

      {/* Loading Skeleton for the entire content */}
      {loadingProfile ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white h-72 rounded-2xl border border-slate-200/50"></div>
          </div>
          <div className="md:col-span-8 bg-white h-96 rounded-2xl border border-slate-200/50"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: Profile card (md:4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col">
              
              {/* Card Banner Header */}
              <div className="h-24 bg-gradient-to-br from-brand-navy to-brand-blue-dark relative flex items-end justify-center p-4">
                <div className="absolute top-3 right-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active
                </div>
              </div>

              {/* Card Main Info */}
              <div className="px-6 pb-6 text-center relative -mt-10 flex-grow flex flex-col items-center">
                {/* Profile Circle */}
                <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-100 shadow-md flex items-center justify-center text-slate-800 font-black text-2xl font-display relative overflow-hidden select-none bg-gradient-to-tr from-slate-200 via-slate-100 to-white">
                  {profile?.email ? profile.email.substring(0, 2).toUpperCase() : 'AD'}
                </div>

                <h3 className="font-display font-extrabold text-slate-900 text-sm mt-3.5 tracking-tight">
                  {profile?.email || 'System Admin'}
                </h3>
                <span className="text-[9px] font-bold text-brand-teal bg-brand-teal/5 border border-brand-teal/10 px-2 py-0.5 rounded-md mt-1">
                  Full Administrator Account
                </span>

                <div className="w-full border-t border-slate-100 my-5"></div>

                {/* Info Fields */}
                <div className="w-full space-y-4 text-left">
                  
                  {/* Email */}
                  <div className="group relative">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Email Address
                    </span>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-700 truncate select-all">{profile?.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(profile?.email || '', 'email')}
                        className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer shrink-0 transition-colors"
                        title="Copy email"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Admin ID */}
                  <div className="group relative">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Administrator ID
                    </span>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-700 truncate select-all">{profile?.id}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(profile?.id || '', 'id')}
                        className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer shrink-0 transition-colors"
                        title="Copy Admin ID"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Created At */}
                  <div>
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Account Registered On
                    </span>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-700 font-semibold">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>

                </div>

                <div className="w-full border-t border-slate-100 my-5"></div>

                {/* Additional Access Badge */}
                <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-brand-teal shrink-0" />
                  <div className="text-left leading-tight">
                    <p className="font-extrabold text-[10px] text-slate-800">Console Privileges</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">Full write access granted. Secure session active.</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* COLUMN 2: Password change form (md:8 cols) */}
          <div className="md:col-span-8">
            <form 
              onSubmit={handlePasswordChange} 
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/50 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 pb-4 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Key className="w-4.5 h-4.5 text-brand-teal" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-900 text-sm">
                    Change Administrator Password
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    For enhanced protection, set a secure password containing numbers, letters, and special symbols.
                  </p>
                </div>
              </div>

              {/* Current Password Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current portal password"
                    disabled={isSubmitting || logoutCountdown !== null}
                    className="w-full bg-slate-50/50 text-slate-900 px-3.5 py-3 rounded-xl border border-slate-200/70 focus:outline-none focus:bg-white focus:border-brand-teal text-xs transition-all font-mono placeholder:font-sans placeholder:text-slate-400/80 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-slate-100 py-1"></div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Set a highly secure new password"
                    disabled={isSubmitting || logoutCountdown !== null}
                    className="w-full bg-slate-50/50 text-slate-900 px-3.5 py-3 rounded-xl border border-slate-200/70 focus:outline-none focus:bg-white focus:border-brand-teal text-xs transition-all font-mono placeholder:font-sans placeholder:text-slate-400/80 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength indicators */}
                {newPassword && (
                  <div className="space-y-2 mt-2 bg-slate-50 border border-slate-100 rounded-xl p-3.5 animate-fade-in">
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase">
                      <span>Password Security Strength</span>
                      <span className="font-extrabold text-slate-700">{getStrengthText()}</span>
                    </div>
                    {/* Strength Bar */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()} transition-all duration-500`}
                        style={{ width: `${getStrengthPercent()}%` }}
                      ></div>
                    </div>
                    {/* Criteria checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Check className="w-2.5 h-2.5 stroke-[3px]" />
                        </div>
                        <span className={`text-[9px] font-semibold ${hasMinLength ? 'text-slate-700' : 'text-slate-400'}`}>
                          At least 6 chars
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasNumber ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Check className="w-2.5 h-2.5 stroke-[3px]" />
                        </div>
                        <span className={`text-[9px] font-semibold ${hasNumber ? 'text-slate-700' : 'text-slate-400'}`}>
                          Contains a number
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasSpecial ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Check className="w-2.5 h-2.5 stroke-[3px]" />
                        </div>
                        <span className={`text-[9px] font-semibold ${hasSpecial ? 'text-slate-700' : 'text-slate-400'}`}>
                          Contains special char
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retype your new password exactly"
                    disabled={isSubmitting || logoutCountdown !== null}
                    className="w-full bg-slate-50/50 text-slate-900 px-3.5 py-3 rounded-xl border border-slate-200/70 focus:outline-none focus:bg-white focus:border-brand-teal text-xs transition-all font-mono placeholder:font-sans placeholder:text-slate-400/80 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Match feedback */}
                {confirmPassword && (
                  <div className="pt-1.5 flex items-center gap-1.5 animate-fade-in">
                    {passwordsMatch ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-600">Passwords match perfectly</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-[9px] font-bold text-rose-600">Passwords do not match yet</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Form Footer Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetForm}
                  disabled={isSubmitting || logoutCountdown !== null || (!currentPassword && !newPassword && !confirmPassword)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer border border-slate-200/80 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-sans"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || logoutCountdown !== null || !currentPassword || !newPassword || !confirmPassword || !passwordsMatch || !hasMinLength}
                  className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed hover:shadow-lg disabled:shadow-none text-xs font-sans shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5" />
                      Update Admin Credentials
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

    </div>
  );
}
