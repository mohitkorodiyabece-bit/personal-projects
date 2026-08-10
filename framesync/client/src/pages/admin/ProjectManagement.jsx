import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FilterControls from '../../components/common/FilterControls.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ProjectTable from '../../components/projects/ProjectTable.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import { getProjects, deleteProject } from '../../services/projectService.js';

const statusOptions = [
  { value: 'created', label: 'Created' },
  { value: 'files_submitted', label: 'Files Submitted' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'editing', label: 'Editing' },
  { value: 'preview_ready', label: 'Preview Ready' },
  { value: 'client_review', label: 'Client Review' },
  { value: 'revision_requested', label: 'Revision Requested' },
  { value: 'final_ready', label: 'Final Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getProjects({ page, limit: 10, search, status });
      setProjects(response.data.projects);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchProjects(1), 300);
    return () => clearTimeout(timeout);
  }, [fetchProjects]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProject(deleteTarget._id);
      toast.success('Project deleted');
      setDeleteTarget(null);
      fetchProjects(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Project Management" subtitle="View and moderate all platform projects">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
        <FilterControls options={statusOptions} value={status} onChange={setStatus} />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading projects..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchProjects(pagination.page)} />
      ) : projects.length === 0 ? (
        <EmptyState title="No projects found" message="Try adjusting your search or filters." />
      ) : (
        <>
          <ProjectTable projects={projects} basePath="/admin/projects" showClient showEditor />
          <div className="flex flex-wrap gap-2">
            {projects.map((p) => (
              <button
                key={p._id}
                type="button"
                onClick={() => setDeleteTarget(p)}
                className="text-xs font-medium text-danger hover:underline"
              >
                Delete &quot;{p.title.slice(0, 24)}{p.title.length > 24 ? '…' : ''}&quot;
              </button>
            ))}
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchProjects} />
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this project?"
        message={`"${deleteTarget?.title}" and all its versions and feedback will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete project"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
};

export default ProjectManagement;