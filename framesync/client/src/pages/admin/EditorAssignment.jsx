import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { getProjects, assignEditor } from '../../services/projectService.js';
import { getEditors } from '../../services/userService.js';

const EditorAssignment = () => {
  const [projects, setProjects] = useState([]);
  const [editors, setEditors] = useState([]);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigning, setAssigning] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [projectsRes, editorsRes] = await Promise.all([
        getProjects({ limit: 50 }),
        getEditors(),
      ]);
      const unassigned = projectsRes.data.projects.filter(
        (p) => !p.assignedEditor && !['completed', 'cancelled'].includes(p.status)
      );
      setProjects(unassigned);
      setEditors(editorsRes.data.editors);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assignment data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async (projectId) => {
    const editorId = selections[projectId];
    if (!editorId) {
      toast.error('Please select an editor first');
      return;
    }

    setAssigning(projectId);
    try {
      await assignEditor(projectId, editorId);
      toast.success('Editor assigned successfully');
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign editor');
    } finally {
      setAssigning(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading unassigned projects..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <DashboardLayout title="Editor Assignment" subtitle="Assign editors to projects awaiting an editor">
      {projects.length === 0 ? (
        <EmptyState
          title="No unassigned projects"
          message="Every active project currently has an editor assigned."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-text-primary">
                    {project.title}
                  </h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  Client: {project.client?.name || 'Unknown'}
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={selections[project._id] || ''}
                  onChange={(e) =>
                    setSelections((prev) => ({ ...prev, [project._id]: e.target.value }))
                  }
                  className="input-field min-w-[180px] cursor-pointer"
                >
                  <option value="">Select editor...</option>
                  {editors.map((editor) => (
                    <option key={editor._id} value={editor._id}>
                      {editor.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleAssign(project._id)}
                  disabled={assigning === project._id}
                  className="btn-primary shrink-0"
                >
                  <UserPlus size={16} />
                  {assigning === project._id ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default EditorAssignment;