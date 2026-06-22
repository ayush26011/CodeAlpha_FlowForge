import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import userService from '../services/userService';
import workspaceService from '../services/workspaceService';
import EmptyState from '../components/ui/EmptyState';
import {
  RiSettings3Line, RiShieldLine, RiNotification3Line,
  RiPaletteLine, RiLogoutBoxLine, RiUserLine, RiLockLine,
  RiUploadCloud2Line, RiGlobalLine, RiSmartphoneLine, RiLoader4Line,
} from 'react-icons/ri';

// Sliding Toggle component for premium design
function Toggle({ checked, onChange, label, sub }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all">
      <div className="min-w-0 mr-4">
        <p className="text-xs font-semibold text-bone truncate">{label}</p>
        {sub && <p className="text-2xs text-olive/85 mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center flex-shrink-0 cursor-pointer
          ${checked ? 'bg-bronze' : 'bg-surface-3 border border-olive/20'}`}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full bg-floral transition-transform absolute left-0.5
            ${checked ? 'translate-x-4.5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const { currentUser, activeWorkspace, updateCurrentUser, loadWorkspaces, showToast, logout } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('account');
  const [uploading, setUploading] = useState(false);

  // Account inputs
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [website, setWebsite] = useState(currentUser?.website || '');
  const [timezone, setTimezone] = useState(currentUser?.timezone || 'UTC');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [title, setTitle] = useState(currentUser?.title || '');
  const [accountType, setAccountType] = useState(currentUser?.accountType || 'Personal');

  // Workspace Settings inputs
  const [wsName, setWsName] = useState(activeWorkspace?.name || '');
  const [wsDesc, setWsDesc] = useState(activeWorkspace?.description || '');

  // Privacy inputs
  const [profileVisibility, setProfileVisibility] = useState(currentUser?.privacy?.profileVisibility ?? true);
  const [activityStatus, setActivityStatus] = useState(currentUser?.privacy?.activityStatus ?? true);
  const [allowInvites, setAllowInvites] = useState(currentUser?.privacy?.allowInvites ?? true);
  const [allowMessages, setAllowMessages] = useState(currentUser?.privacy?.allowMessages ?? true);

  // Notifications inputs
  const [taskAssigned, setTaskAssigned] = useState(currentUser?.notifications?.taskAssigned ?? true);
  const [taskUpdated, setTaskUpdated] = useState(currentUser?.notifications?.taskUpdated ?? true);
  const [comments, setComments] = useState(currentUser?.notifications?.comments ?? true);
  const [mentions, setMentions] = useState(currentUser?.notifications?.mentions ?? true);
  const [notifEmail, setNotifEmail] = useState(currentUser?.notifications?.email ?? true);
  const [notifPush, setNotifPush] = useState(currentUser?.notifications?.push ?? false);
  const [dueDateReminders, setDueDateReminders] = useState(currentUser?.notifications?.dueDateReminders ?? true);
  const [workspaceUpdates, setWorkspaceUpdates] = useState(currentUser?.notifications?.workspaceUpdates ?? true);

  // Appearance inputs
  const [themeMode, setThemeMode] = useState(currentUser?.appearance?.themeMode || 'dark');
  const [reduceMotion, setReduceMotion] = useState(currentUser?.appearance?.reduceMotion ?? false);
  const [compactMode, setCompactMode] = useState(currentUser?.appearance?.compactMode ?? false);

  // Security inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginAlerts, setLoginAlerts] = useState(currentUser?.security?.loginAlerts ?? true);
  const [savedDevices, setSavedDevices] = useState(currentUser?.security?.savedDevices || ['Chrome on macOS (Current)']);

  // Synchronize local states when asynchronous context data loads
  useEffect(() => {
    if (currentUser) {
      Promise.resolve().then(() => {
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || '');
        setBio(currentUser.bio || '');
        setWebsite(currentUser.website || '');
        setTimezone(currentUser.timezone || 'UTC');
        setLocation(currentUser.location || '');
        setTitle(currentUser.title || '');
        setAccountType(currentUser.accountType || 'Personal');

        setProfileVisibility(currentUser.privacy?.profileVisibility ?? true);
        setActivityStatus(currentUser.privacy?.activityStatus ?? true);
        setAllowInvites(currentUser.privacy?.allowInvites ?? true);
        setAllowMessages(currentUser.privacy?.allowMessages ?? true);

        setTaskAssigned(currentUser.notifications?.taskAssigned ?? true);
        setTaskUpdated(currentUser.notifications?.taskUpdated ?? true);
        setComments(currentUser.notifications?.comments ?? true);
        setMentions(currentUser.notifications?.mentions ?? true);
        setNotifEmail(currentUser.notifications?.email ?? true);
        setNotifPush(currentUser.notifications?.push ?? false);
        setDueDateReminders(currentUser.notifications?.dueDateReminders ?? true);
        setWorkspaceUpdates(currentUser.notifications?.workspaceUpdates ?? true);

        setThemeMode(currentUser.appearance?.themeMode || 'dark');
        setReduceMotion(currentUser.appearance?.reduceMotion ?? false);
        setCompactMode(currentUser.appearance?.compactMode ?? false);

        setLoginAlerts(currentUser.security?.loginAlerts ?? true);
        setSavedDevices(currentUser.security?.savedDevices || ['Chrome on macOS (Current)']);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeWorkspace) {
      Promise.resolve().then(() => {
        setWsName(activeWorkspace.name || '');
        setWsDesc(activeWorkspace.description || '');
      });
    }
  }, [activeWorkspace]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-24">
        <RiLoader4Line className="animate-spin text-3xl text-olive" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await userService.updateProfile({ name, email, phone, bio, website, timezone, location, title, accountType });
      updateCurrentUser(updatedUser);
      showToast('Profile updated successfully!', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleUpdateWorkspace = async () => {
    try {
      await workspaceService.update(activeWorkspace._id, { name: wsName, description: wsDesc });
      await loadWorkspaces();
      showToast('Workspace updated successfully!', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleSavePrivacy = async () => {
    try {
      const updatedUser = await userService.updatePrivacy({ profileVisibility, activityStatus, allowInvites, allowMessages });
      updateCurrentUser(updatedUser);
      showToast('Privacy preferences updated!', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      const updatedUser = await userService.updateNotifications({ taskAssigned, taskUpdated, comments, mentions, email: notifEmail, push: notifPush, dueDateReminders, workspaceUpdates });
      updateCurrentUser(updatedUser);
      showToast('Notification settings saved!', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleSaveAppearance = async () => {
    try {
      const updatedUser = await userService.updateAppearance({ themeMode, reduceMotion, compactMode });
      updateCurrentUser(updatedUser);
      showToast('Appearance settings saved!', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    try {
      await userService.changePassword(currentPassword, newPassword);
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleSaveSecurity = async () => {
    try {
      const updatedUser = await userService.updateSecuritySettings({ loginAlerts });
      updateCurrentUser(updatedUser);
      showToast('Security preferences saved!', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleRemoveDevice = async (device) => {
    try {
      const updatedUser = await userService.updateSecuritySettings({ removeDevice: device });
      updateCurrentUser(updatedUser);
      showToast('Device removed.', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      showToast('Uploading avatar...', 'success');
      const updatedUser = await userService.uploadAvatar(file);
      updateCurrentUser(updatedUser);
      showToast('Avatar updated successfully!', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: RiUserLine },
    { id: 'workspace', label: 'Workspace Settings', icon: RiSettings3Line },
    { id: 'privacy', label: 'Privacy', icon: RiShieldLine },
    { id: 'notifications', label: 'Notifications', icon: RiNotification3Line },
    { id: 'appearance', label: 'Appearance', icon: RiPaletteLine },
    { id: 'security', label: 'Security', icon: RiLockLine },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
          <RiSettings3Line className="text-bronze-light text-base" />
        </div>
        <h1 className="page-title text-base font-bold text-floral">Settings</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Navigation Selector segments */}
        <div className="md:col-span-1 flex flex-col gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-left
                ${activeTab === tab.id
                  ? 'bg-surface text-bone border border-white/5 shadow-xs font-bold'
                  : 'text-olive hover:text-bone hover:bg-white/5 border border-transparent'}`}
            >
              <tab.icon className="text-base" />
              <span>{tab.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-950/20 transition-all mt-4 cursor-pointer text-left"
          >
            <RiLogoutBoxLine className="text-base" />
            <span>Logout</span>
          </button>
        </div>

        {/* Right Settings Detail Panels */}
        <div className="md:col-span-3 card p-6 space-y-6" style={{ background: 'rgba(22,23,16,0.6)', backdropFilter: 'blur(8px)', borderColor: 'rgba(86,84,73,0.15)' }}>
          
          {/* Account Form updates */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="section-title">Account Profile</h2>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full bg-surface-3 object-cover border border-white/10"
                  onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`; }}
                />
                <div>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary text-2xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer py-2"
                  >
                    <RiUploadCloud2Line className="text-sm" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-[10px] text-olive/60 mt-1.5 font-medium">Max size 5MB. Powered by Cloudinary.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="label">Biography</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows="3"
                  placeholder="Tell us about yourself..."
                  className="input resize-none text-xs"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Lead Designer, Software Engineer"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="input text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Account Type</label>
                  <select
                    value={accountType}
                    onChange={e => setAccountType(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Business">Business</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="label">Timezone</label>
                  <select
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT/BST)</option>
                    <option value="Europe/Paris">Paris (CET/CEST)</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button onClick={handleSaveProfile} className="btn-primary text-2xs uppercase tracking-wider py-2">Save Profile Changes</button>
              </div>
            </div>
          )}

          {/* Workspace info updates */}
          {activeTab === 'workspace' && (
            activeWorkspace ? (
              <div className="space-y-4">
                <h2 className="section-title">Workspace Configuration</h2>
                <div>
                  <label className="label">Workspace Name</label>
                  <input
                    type="text"
                    value={wsName}
                    onChange={e => setWsName(e.target.value)}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={wsDesc}
                    onChange={e => setWsDesc(e.target.value)}
                    rows="3"
                    className="input resize-none text-xs"
                  />
                </div>
                <div className="pt-2">
                  <button onClick={handleUpdateWorkspace} className="btn-primary text-2xs uppercase tracking-wider py-2">Update Workspace</button>
                </div>
              </div>
            ) : (
              <EmptyState
                icon="🗂️"
                title="No Workspace Selected"
                description="Create or select a workspace to configure its settings."
                action={{ label: 'Go to Workspaces', onClick: () => navigate('/workspace') }}
              />
            )
          )}

          {/* Privacy Toggle panel */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <h2 className="section-title">Privacy Settings</h2>
              
              <div className="space-y-3">
                <Toggle
                  checked={profileVisibility}
                  onChange={setProfileVisibility}
                  label="Profile Visibility"
                  sub="Allow search and workspace index to list your profile details."
                />
                <Toggle
                  checked={activityStatus}
                  onChange={setActivityStatus}
                  label="Activity Status"
                  sub="Display active indicators when you are currently online."
                />
                <Toggle
                  checked={allowInvites}
                  onChange={setAllowInvites}
                  label="Allow Invites"
                  sub="Enable other members to invite you to custom workspaces."
                />
                <Toggle
                  checked={allowMessages}
                  onChange={setAllowMessages}
                  label="Allow Messages"
                  sub="Permit project members to direct message your account."
                />
              </div>

              <div className="pt-2">
                <button onClick={handleSavePrivacy} className="btn-primary text-2xs uppercase tracking-wider py-2">Save Privacy Preferences</button>
              </div>
            </div>
          )}

          {/* Notifications config */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="section-title">Notification Preferences</h2>
              
              <div className="space-y-3">
                <Toggle
                  checked={taskAssigned}
                  onChange={setTaskAssigned}
                  label="Task Assigned"
                  sub="Notify when you are assigned to a new card."
                />
                <Toggle
                  checked={taskUpdated}
                  onChange={setTaskUpdated}
                  label="Task Updated"
                  sub="Notify when cards assigned to you change columns."
                />
                <Toggle
                  checked={comments}
                  onChange={setComments}
                  label="Comments"
                  sub="Notify when new comments are posted on your tasks."
                />
                <Toggle
                  checked={mentions}
                  onChange={setMentions}
                  label="Mentions"
                  sub="Notify when someone mentions you inside a description or comment."
                />
                <Toggle
                  checked={notifEmail}
                  onChange={setNotifEmail}
                  label="Email Digests"
                  sub="Send summary updates and activity digests to your email inbox."
                />
                <Toggle
                  checked={notifPush}
                  onChange={setNotifPush}
                  label="Desktop Push Notifications"
                  sub="Show browser push notifications instantly for task events."
                />
                <Toggle
                  checked={dueDateReminders}
                  onChange={setDueDateReminders}
                  label="Due Date Reminders"
                  sub="Receive notifications as task deadlines approach."
                />
                <Toggle
                  checked={workspaceUpdates}
                  onChange={setWorkspaceUpdates}
                  label="Workspace Updates"
                  sub="Receive updates when projects are created or modified."
                />
              </div>

              <div className="pt-2">
                <button onClick={handleSaveNotifications} className="btn-primary text-2xs uppercase tracking-wider py-2">Save Notification Preferences</button>
              </div>
            </div>
          )}

          {/* Theme selector */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <h2 className="section-title">Visual Customization</h2>
              
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setThemeMode(mode)}
                    className={`card p-4 text-center cursor-pointer capitalize border-2 transition-all
                      ${themeMode === mode ? 'border-bronze bg-surface-2' : 'border-white/5 hover:border-white/10'}`}
                  >
                    <p className="text-xs font-semibold text-bone">{mode}</p>
                    <p className="text-[10px] text-olive mt-1">{mode === 'dark' ? 'Default theme' : 'Select mode'}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-3 pt-3">
                <Toggle
                  checked={reduceMotion}
                  onChange={setReduceMotion}
                  label="Reduce Motion"
                  sub="Disable transitions and UI animations to increase performance."
                />
                <Toggle
                  checked={compactMode}
                  onChange={setCompactMode}
                  label="Compact Mode"
                  sub="Dense layout scaling to maximize vertical space."
                />
              </div>

              <div className="pt-2">
                <button onClick={handleSaveAppearance} className="btn-primary text-2xs uppercase tracking-wider py-2">Save Appearance settings</button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <h2 className="section-title">Change Password</h2>
                <div>
                  <label className="label">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="input font-mono text-xs"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="input font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="input font-mono text-xs"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="btn-primary text-2xs uppercase tracking-wider py-2">Update Account Password</button>
                </div>
              </form>

              <hr className="border-white/5" />

              {/* Login Alerts Toggle */}
              <div className="space-y-4">
                <h2 className="section-title">Security Settings</h2>
                <Toggle
                  checked={loginAlerts}
                  onChange={setLoginAlerts}
                  label="Login Alerts"
                  sub="Receive security updates whenever a login succeeds on a new device."
                />
                <Toggle
                  checked={false}
                  onChange={() => showToast('Two-Factor Authentication is currently being forged.', 'info')}
                  label="Two-Factor Authentication (2FA)"
                  sub="Add an extra layer of protection to your account with authenticator apps."
                />
                <div className="pt-1">
                  <button onClick={handleSaveSecurity} className="btn-primary text-2xs uppercase tracking-wider py-2">Save Security Preferences</button>
                </div>
              </div>

              <hr className="border-white/5" />

              {/* Saved Devices list */}
              <div className="space-y-4">
                <h2 className="section-title">Authorized Devices</h2>
                <div className="space-y-2.5">
                  {savedDevices.map((device, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/5 text-sm">
                      <div className="flex items-center gap-3">
                        {device.includes('Mobile') ? (
                          <RiSmartphoneLine className="text-lg text-olive" />
                        ) : (
                          <RiGlobalLine className="text-lg text-olive" />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-bone">{device}</p>
                          <p className="text-[10px] text-olive/60 mt-0.5 font-medium">Active Session</p>
                        </div>
                      </div>
                      {device.includes('Current') ? (
                        <span className="text-[10px] font-semibold text-green-400 bg-green-950/20 px-2 py-0.5 rounded-full border border-green-500/20">Current</span>
                      ) : (
                        <button
                          onClick={() => handleRemoveDevice(device)}
                          className="text-[10px] font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          Revoke Access
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
