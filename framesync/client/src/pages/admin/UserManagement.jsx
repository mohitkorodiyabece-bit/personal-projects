import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FilterControls from '../../components/common/FilterControls.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import { getAllUsers, updateUserRole, updateUserStatus } from '../../services/userService.js';
import { formatDate } from '../../utils/formatDate.js';
import useAuth from '../../hooks/useAuth.js';

const roleOptions = [
  { value: 'client', label: 'Client' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
];

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusModal, setStatusModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllUsers({ page, limit: 10, search, role });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchUsers(1), 300);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('User role updated');
      fetchUsers(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleStatusToggle = async () => {
    if (!statusModal) return;
    setActionLoading(true);
    try {
      await updateUserStatus(statusModal.id, !statusModal.isActive);
      toast.success(`User ${!statusModal.isActive ? 'activated' : 'deactivated'}`);
      setStatusModal(null);
      fetchUsers(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout title="User Management" subtitle="View and manage all platform users">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." />
        <FilterControls options={roleOptions} value={role} onChange={setRole} label="Filter by role" />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading users..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchUsers(pagination.page)} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" message="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary/50 text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40">
                      <td className="px-4 py-3 font-medium text-text-primary">{u.name}</td>
                      <td className="px-4 py-3 text-text-muted">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={u._id === currentUser?._id}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="rounded-lg border border-border bg-surface-secondary px-2 py-1.5 text-xs text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {roleOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            u.isActive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          disabled={u._id === currentUser?._id}
                          onClick={() => setStatusModal({ id: u._id, isActive: u.isActive, name: u.name })}
                          className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchUsers} />
        </>
      )}

      <ConfirmModal
        isOpen={!!statusModal}
        title={statusModal?.isActive ? 'Deactivate user?' : 'Activate user?'}
        message={`This will ${statusModal?.isActive ? 'deactivate' : 'activate'} ${statusModal?.name}'s account.`}
        confirmLabel={statusModal?.isActive ? 'Deactivate' : 'Activate'}
        danger={statusModal?.isActive}
        loading={actionLoading}
        onConfirm={handleStatusToggle}
        onCancel={() => setStatusModal(null)}
      />
    </DashboardLayout>
  );
};

export default UserManagement;