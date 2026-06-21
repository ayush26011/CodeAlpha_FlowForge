import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import workspaceService from '../services/workspaceService';
import { Avatar } from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import {
  RiMailSendLine, RiUserAddLine, RiSearchLine, RiMore2Fill,
  RiTeamLine, RiCloseLine, RiLoader4Line, RiShieldLine,
  RiUserLine, RiDeleteBinLine, RiCheckLine,
} from 'react-icons/ri';

const ROLES = ['Admin', 'Member', 'Viewer'];

// ── Invite Modal ──────────────────────────────────────────────────────────────
function InviteModal({ workspace, onClose, onInvited }) {
  const [email, setEmail]     = useState('');
  const [role, setRole]       = useState('Member');
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) { setError('Email is required.'); return; }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(trimmed)) { setError('Enter a valid email address.'); return; }

    setSaving(true);
    setError('');
    try {
      const updatedWorkspace = await workspaceService.addMember(workspace._id, trimmed, role);
      onInvited(updatedWorkspace);
    } catch (err) {
      // Surface the backend error message directly (e.g. "No user found…")
      setError(err.response?.data?.message || err.message || 'Failed to invite member.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-smoky/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="card w-full max-w-md p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-floral">Invite Member</h2>
          <button id="close-invite-modal" onClick={onClose} className="btn-ghost p-1.5">
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        <p className="text-sm text-olive">
          Invite someone to <span className="text-bone font-medium">{workspace.name}</span> by their registered email.
        </p>

        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="label" htmlFor="invite-email">Email Address</label>
            <input
              id="invite-email"
              type="email"
              required
              autoFocus
              placeholder="colleague@company.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="input w-full"
            />
          </div>

          <div>
            <label className="label" htmlFor="invite-role">Role</label>
            <select
              id="invite-role"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="input w-full"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="px-3 py-2.5 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              id="submit-invite"
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving
                ? <><RiLoader4Line className="animate-spin" /> Inviting…</>
                : <><RiMailSendLine /> Send Invite</>
              }
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Member Card ───────────────────────────────────────────────────────────────
function MemberCard({ member, isOwner, canManage, onRoleChange, onRemove, currentUserId }) {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [changing, setChanging]   = useState(false);

  const handleRoleChange = async (newRole) => {
    if (newRole === member.role) { setMenuOpen(false); return; }
    setChanging(true);
    setMenuOpen(false);
    try {
      await onRoleChange(member.id, newRole);
    } finally {
      setChanging(false);
    }
  };

  const handleRemove = async () => {
    setMenuOpen(false);
    await onRemove(member.id);
  };

  const isSelf = member.id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar user={member} size="lg" showStatus />
          <div>
            <h3 className="text-sm font-semibold text-bone">
              {member.name} {isSelf && <span className="text-xs text-olive">(you)</span>}
            </h3>
            <p className="text-xs text-olive">{member.role}</p>
          </div>
        </div>

        {/* Actions menu — only for admins/owner, or self-remove */}
        {(canManage || isSelf) && !isOwner && (
          <div className="relative">
            <button
              className="btn-ghost p-1.5 text-olive hover:text-bone"
              onClick={() => setMenuOpen(o => !o)}
              disabled={changing}
            >
              {changing ? <RiLoader4Line className="animate-spin" /> : <RiMore2Fill />}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  className="absolute right-0 top-8 w-44 bg-surface-2 border border-border rounded-xl shadow-lg z-10 overflow-hidden py-1"
                >
                  {canManage && ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-surface-3 transition-colors"
                    >
                      {member.role === r
                        ? <RiCheckLine className="text-bronze flex-shrink-0" />
                        : <span className="w-4 flex-shrink-0" />
                      }
                      <span className={member.role === r ? 'text-bone font-medium' : 'text-olive'}>
                        Set as {r}
                      </span>
                    </button>
                  ))}
                  {(canManage || isSelf) && (
                    <button
                      onClick={handleRemove}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-red-400 hover:bg-red-900/20 transition-colors border-t border-border mt-1"
                    >
                      <RiDeleteBinLine />
                      {isSelf ? 'Leave workspace' : 'Remove member'}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-olive">
        <span className="truncate">{member.email}</span>
        <span className={`ml-2 px-2 py-0.5 rounded-full flex-shrink-0 ${
          member.online ? 'text-green-400 bg-green-950/20' : 'bg-surface-3 text-olive'
        }`}>
          {member.online ? 'online' : 'offline'}
        </span>
      </div>

      {member.joinedAt && (
        <p className="text-xs text-olive/60">
          Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}
    </motion.div>
  );
}

// ── Main Team page ────────────────────────────────────────────────────────────
export default function Team() {
  const {
    activeWorkspace, currentUser,
    syncWorkspace, loadWorkspaces, showToast,
  } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm]       = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [pendingInvites, setPendingInvites]   = useState([]); // local session state

  // ── No workspace: empty state ─────────────────────────────────────────────
  if (!activeWorkspace) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">Team Collaboration</h1>
            <p className="text-sm text-olive mt-0.5">Manage your organization's team members and roles.</p>
          </div>
        </div>
        <div className="card">
          <EmptyState
            icon={<RiTeamLine />}
            title="No Workspace Selected"
            description="Create or select a workspace first to manage team members and send invitations."
            action={{ label: 'Go to Workspaces', onClick: () => navigate('/workspace') }}
          />
        </div>
      </motion.div>
    );
  }

  // Build member list from activeWorkspace (always fresh from context)
  const members = (activeWorkspace.members || []).map(m => ({
    ...(m.user || m),
    id:       m.user?._id  || m.user || m._id,
    role:     m.role       || 'Member',
    joinedAt: m.joinedAt,
    isOwner:  (m.user?._id || m.user || m._id)?.toString() === activeWorkspace.owner?._id?.toString()
              || (m.user?._id || m.user || m._id)?.toString() === activeWorkspace.owner?.toString(),
  }));

  const filteredMembers = members.filter(u =>
    !searchTerm ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine if current user is admin/owner
  const myMembership = members.find(m => m.id?.toString() === currentUser?._id?.toString());
  const canManage = myMembership?.isOwner || myMembership?.role === 'Admin';

  // ── Invite success handler ─────────────────────────────────────────────────
  const handleInvited = (updatedWorkspace) => {
    syncWorkspace(updatedWorkspace);
    setShowInviteModal(false);
    showToast('Member invited successfully!', 'success');
  };

  // ── Role change ────────────────────────────────────────────────────────────
  const handleRoleChange = async (userId, newRole) => {
    try {
      const updated = await workspaceService.updateMemberRole(activeWorkspace._id, userId, newRole);
      if (updated) syncWorkspace(updated);
      showToast(`Role updated to ${newRole}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  // ── Remove member ─────────────────────────────────────────────────────────
  const handleRemove = async (userId) => {
    try {
      const updated = await workspaceService.removeMember(activeWorkspace._id, userId);
      if (updated) syncWorkspace(updated);
      else await loadWorkspaces(); // fallback
      showToast('Member removed.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Team Collaboration</h1>
          <p className="text-sm text-olive mt-0.5">
            {activeWorkspace.name} · {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canManage && (
          <button
            id="invite-member-btn"
            onClick={() => setShowInviteModal(true)}
            className="btn-primary text-sm gap-2"
          >
            <RiUserAddLine className="text-lg" /> Invite Member
          </button>
        )}
      </div>

      {/* Search + stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive" />
          <input
            id="search-members"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search members..."
            className="input pl-10 text-sm w-full"
          />
        </div>
        <div className="flex gap-4 text-xs text-olive">
          <span>Total: <strong className="text-bone">{members.length}</strong></span>
          <span>Online: <strong className="text-green-500">{members.filter(u => u.online).length}</strong></span>
          <span>Admins: <strong className="text-bronze">{members.filter(u => u.role === 'Admin').length}</strong></span>
        </div>
      </div>

      {/* Members grid */}
      {filteredMembers.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-olive text-sm">
            {searchTerm ? `No members match "${searchTerm}"` : 'No members yet.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              isOwner={member.isOwner}
              canManage={canManage}
              onRoleChange={handleRoleChange}
              onRemove={handleRemove}
              currentUserId={currentUser?._id}
            />
          ))}
        </div>
      )}

      {/* Pending invites (session-local) */}
      {pendingInvites.length > 0 && (
        <div className="space-y-3">
          <h2 className="section-title">Pending Invitations</h2>
          <div className="card divide-y divide-border overflow-hidden">
            {pendingInvites.map((inv, idx) => (
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
                <span className="badge bg-bronze/15 text-bronze border border-bronze/35">Invited</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite modal */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteModal
            workspace={activeWorkspace}
            onClose={() => setShowInviteModal(false)}
            onInvited={handleInvited}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
