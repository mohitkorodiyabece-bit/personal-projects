import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ExternalLink,
  PlayCircle,
  UploadCloud,
  Save,
  Scissors,
} from 'lucide-react';

import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import PriorityBadge from '../../components/common/PriorityBadge.jsx';
import DeadlineDisplay from '../../components/projects/DeadlineDisplay.jsx';
import ProjectProgress from '../../components/projects/ProjectProgress.jsx';

import {
  getProjectById,
  updateProjectStatus,
  submitFinalDelivery,
} from '../../services/projectService.js';

import { getVersions } from '../../services/versionService.js';

const ProjectWorkspace = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [versionCount, setVersionCount] = useState(0);
  const [finalDeliveryLink, setFinalDeliveryLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [projectResponse, versionsResponse] = await Promise.all([
        getProjectById(id),

        getVersions(id).catch(() => ({
          data: {
            count: 0,
          },
        })),
      ]);

      const loadedProject = projectResponse.data.project;

      setProject(loadedProject);
      setFinalDeliveryLink(loadedProject.finalDeliveryLink || '');
      setVersionCount(versionsResponse.data.count || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load project workspace'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeStatus = async (status) => {
    setActionLoading(true);

    try {
      const response = await updateProjectStatus(id, status);

      setProject(response.data.project);

      toast.success(
        `Project status changed to ${status.replaceAll('_', ' ')}`
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to update project status'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinalDelivery = async (event) => {
    event.preventDefault();

    const trimmedLink = finalDeliveryLink.trim();

    if (!trimmedLink) {
      toast.error('Final delivery link is required');
      return;
    }

    try {
      const parsedUrl = new URL(trimmedLink);

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid URL protocol');
      }
    } catch {
      toast.error('Enter a valid final delivery URL');
      return;
    }

    setActionLoading(true);

    try {
      const response = await submitFinalDelivery(id, trimmedLink);

      setProject(response.data.project);

      toast.success('Final delivery submitted successfully');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to submit final delivery'
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        fullScreen
        label="Loading project workspace..."
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchData}
      />
    );
  }

  if (!project) {
    return null;
  }

  return (
    <DashboardLayout
      title={project.title}
      subtitle={`Client: ${project.client?.name || 'Unknown client'}`}
      actions={
        <>
          {versionCount > 0 && (
            <Link
              to={`/editor/projects/${id}/review`}
              className="btn-secondary"
            >
              <PlayCircle size={16} />
              Review feedback
            </Link>
          )}

          <Link
            to={`/editor/projects/${id}/upload`}
            className="btn-primary"
          >
            <UploadCloud size={16} />
            Upload version
          </Link>
        </>
      }
    >
      <div className="card p-5">
        <ProjectProgress status={project.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="card p-5">
            <h2 className="text-base font-semibold text-text-primary">
              Editing brief
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm text-text-muted">
              {project.description}
            </p>
          </div>

          {project.rawFileLinks?.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 text-base font-semibold text-text-primary">
                Raw footage
              </h2>

              <div className="flex flex-col gap-2">
                {project.rawFileLinks.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-primary hover:border-primary/40"
                  >
                    <span className="truncate">
                      {link.label || link.url}
                    </span>

                    <ExternalLink size={15} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {project.referenceLinks?.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 text-base font-semibold text-text-primary">
                References
              </h2>

              <div className="flex flex-col gap-2">
                {project.referenceLinks.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-primary hover:border-primary/40"
                  >
                    <span className="truncate">
                      {link.label || link.url}
                    </span>

                    <ExternalLink size={15} />
                  </a>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={handleFinalDelivery}
            className="card p-5"
          >
            <h2 className="text-base font-semibold text-text-primary">
              Final delivery
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Paste a Google Drive, Dropbox, OneDrive, or another
              final-delivery URL.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                value={finalDeliveryLink}
                onChange={(event) =>
                  setFinalDeliveryLink(event.target.value)
                }
                className="input-field"
                placeholder="https://..."
                required
              />

              <button
                type="submit"
                disabled={actionLoading}
                className="btn-primary shrink-0"
              >
                <Save size={16} />

                {actionLoading
                  ? 'Submitting...'
                  : 'Submit final'}
              </button>
            </div>
          </form>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="card flex flex-col gap-4 p-5">
            <h2 className="text-base font-semibold text-text-primary">
              Project details
            </h2>

            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Status
              </span>

              <StatusBadge status={project.status} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Priority
              </span>

              <PriorityBadge priority={project.priority} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Deadline
              </span>

              <DeadlineDisplay
                deadline={project.deadline}
                status={project.status}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Budget
              </span>

              <span className="text-text-primary">
                ${project.budget}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Versions
              </span>

              <span className="text-text-primary">
                {versionCount}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Revisions
              </span>

              <span className="text-text-primary">
                {project.revisionsUsed} / {project.revisionLimit}
              </span>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-semibold text-text-primary">
              Workflow
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              {project.status === 'assigned' && (
                <button
                  type="button"
                  onClick={() => changeStatus('editing')}
                  disabled={actionLoading}
                  className="btn-primary w-full"
                >
                  <Scissors size={16} />
                  Start editing
                </button>
              )}

              {project.status === 'revision_requested' && (
                <button
                  type="button"
                  onClick={() => changeStatus('editing')}
                  disabled={actionLoading}
                  className="btn-primary w-full"
                >
                  <Scissors size={16} />
                  Start revision
                </button>
              )}

              {['preview_ready', 'client_review'].includes(
                project.status
              ) && (
                <p className="text-sm text-text-muted">
                  The client is reviewing the latest uploaded version.
                </p>
              )}

              {project.status === 'final_ready' && (
                <p className="text-sm font-medium text-warning">
                  The final delivery is waiting for client approval.
                </p>
              )}

              {project.status === 'completed' && (
                <p className="text-sm font-medium text-success">
                  This project has been completed and approved.
                </p>
              )}

              {project.status === 'cancelled' && (
                <p className="text-sm font-medium text-danger">
                  This project has been cancelled.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default ProjectWorkspace;