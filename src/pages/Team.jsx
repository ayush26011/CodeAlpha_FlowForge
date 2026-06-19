import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import workspaceService from '../services/workspaceService';
import { Avatar } from '../components/ui/Avatar';
import { RiMailSendLine, RiUserAddLine, RiSearchLine, RiMore2Fill } from 'react-icons/ri';

export default function Team() {
  const { activeWorkspace, loadWorkspaces, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');
  const [invitedList, setInvitedList] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!activeWorkspace) return null;

  const members = (activeWorkspace.members || []).map(m => ({
    ...(m.user || m),
    id: m.user?._id || m.user || m._id,
    role: m.role || m.user?.role || 'Member'
  }));

  const filteredMembers = members.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      await workspaceService.addMember(activeWorkspace._id, inviteEmail, inviteRole);
      await loadWorkspaces();
      setInvitedList(prev => [...prev, {
        email: inviteEmail,
        role: inviteRole,
        status: 'Invited',
        sentAt: 'Just now'
      }]);
      showToast('Member invited successfully!', 'success');
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Team Collaboration</h1>
          <p className="text-sm text-olive mt-0.5">Manage your organization's team members and roles.</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="btn-primary text-sm gap-2"
        >
          <RiUserAddLine className="text-lg" /> Invite Member
        </button>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search members..."
            className="input pl-10 text-sm"
          />
        </div>
        <div className="flex gap-4 text-xs text-olive">
          <span>Total: <strong className="text-bone">{members.length}</strong></span>
          <span>Online: <strong className="text-green-500">{members.filter(u => u.online).length}</strong></span>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="card p-5 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar user={member} size="lg" showStatus />
                <div>
                  <h3 className="text-sm font-semibold text-bone">{member.name}</h3>
                  <p className="text-xs text-olive">{member.role}</p>
                </div>
              </div>
              <button className="btn-ghost p-1.5 text-olive hover:text-bone">
                <RiMore2Fill />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-olive">
              <span>{member.email}</span>
              <span className={`px-2 py-0.5 rounded-full ${member.online ? 'text-green-400 bg-green-950/20' : 'bg-surface-3 text-olive'}`}>
                {member.online ? 'online' : 'offline'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Invited List */}
      {invitedList.length > 0 && (
        <div className="space-y-3">
          <h2 className="section-title">Pending Invitations</h2>
          <div className="card divide-y divide-border overflow-hidden">
            {invitedList.map((inv, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-olive">
                    <RiMailSendLine className="text-lg" />
                  </div>
                  <div>
                    <p className="font-medium text-bone">{inv.email}</p>
                    <p className="text-xs text-olive">Role: {inv.role} · Sent {inv.sentAt}</p>
                  </div>
                </div>
                <span className="badge bg-bronze/15 text-bronze-light border border-bronze/35">
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal Overlay */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div onClick={() => setShowInviteModal(false)} className="absolute inset-0 bg-smoky/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-md w-full p-6 relative z-10 space-y-4"
          >
            <h2 className="text-lg font-bold text-floral">Invite New Member</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="input"
                >
                  <option value="Admin">Admin</option>
                  <option value="Designer">Designer</option>
                  <option value="Developer">Developer</option>
                  <option value="PM">Product Manager</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
