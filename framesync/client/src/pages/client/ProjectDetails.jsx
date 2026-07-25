import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ExternalLink, PlayCircle, XCircle } from 'lucide-react';

import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import PriorityBadge from '../../components/common/PriorityBadge.jsx';
import DeadlineDisplay from '../../components/projects/DeadlineDisplay.jsx';
import ProjectProgress from '../../components/projects/ProjectProgress.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

import {
  getProjectById,
  updateProjectStatus,
} from '../../services/projectService.js';

import { getVersions } from '../../services/versionService.js';

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [versionCount, setVersionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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

      setProject(projectResponse.data.project);
      setVersionCount(versionsResponse.data.count || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load project details'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancel = async () => {
    setCancelling(true);

    try {
      await updateProjectStatus(id, 'cancelled');

      toast.success('Project cancelled');

      setShowCancelModal(false);

      await fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to cancel project'
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        fullScreen
        label="Loading project..."
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

  const canCancel = ![
    'completed',
    'cancelled',
  ].includes(project.status);

  const videoType = project.videoType
    ? project.videoType.replaceAll('_', ' ')
    : 'Not specified';

  return (
    <DashboardLayout
      title={project.title}
      subtitle={`Created ${new Date(
        project.createdAt
      ).toLocaleDateString()}`}
      actions={
        <>
          {versionCount > 0 && (
            <Link
              to={`/client/projects/${id}/review`}
              className="btn-primary"
            >
              <PlayCircle size={16} />
              Review videos
            </Link>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="btn-danger"
            >
              <XCircle size={16} />
              Cancel project
            </button>
          )}
        </>
      }
    >
      <div className="card p-5">
        <ProjectProgress status={project.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="card p-5">
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              Description
            </h2>

            <p className="whitespace-pre-line text-sm text-text-muted">
              {project.description}
            </p>
          </div>

          {project.rawFileLinks?.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 text-base font-semibold text-text-primary">
                Raw Footage Links
              </h2>

              <div className="flex flex-col gap-2">
                {project.rawFileLinks.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-secondary px-4 py-2.5 text-sm text-primary transition-colors hover:bg-surface"
                  >
                    <span className="truncate">
                      {link.label || link.url}
                    </span>

                    <ExternalLink
                      size={14}
                      className="shrink-0"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {project.referenceLinks?.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 text-base font-semibold text-text-primary">
                Reference Links
              </h2>

              <div className="flex flex-col gap-2">
                {project.referenceLinks.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-secondary px-4 py-2.5 text-sm text-primary transition-colors hover:bg-surface"
                  >
                    <span className="truncate">
                      {link.label || link.url}
                    </span>

                    <ExternalLink
                      size={14}
                      className="shrink-0"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {project.finalDeliveryLink && (
            <div className="card border-success/30 bg-success/5 p-5">
              <h2 className="mb-3 text-base font-semibold text-text-primary">
                Final Delivery
              </h2>

              <a
                href={project.finalDeliveryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-success/30 bg-surface px-4 py-2.5 text-sm text-success transition-colors hover:bg-surface-secondary"
              >
                <span className="truncate">
                  Open final delivery
                </span>

                <ExternalLink
                  size={14}
                  className="shrink-0"
                />
              </a>

              {project.status === 'final_ready' && (
                <Link
                  to={`/client/projects/${id}/review`}
                  className="btn-primary mt-3"
                >
                  Review and approve
                </Link>
              )}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="card flex flex-col gap-4 p-5">
            <h2 className="text-base font-semibold text-text-primary">
              Project Info
            </h2>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-text-muted">
                Status
              </span>

              <StatusBadge status={project.status} />
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-text-muted">
                Priority
              </span>

              <PriorityBadge priority={project.priority} />
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-text-muted">
                Deadline
              </span>

              <DeadlineDisplay
                deadline={project.deadline}
                status={project.status}
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-text-muted">
                Budget
              </span>

              <span className="text-text-primary">
                ${project.budget}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-text-muted">
                Video Type
              </span>

              <span className="text-right capitalize text-text-primary">
                {videoType}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-text-muted">
                Editing Style
              </span>

              <span className="text-right text-text-primary">
                {project.editingStyle || 'Not specified'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-text-muted">
                Revisions
              </span>

              <span className="text-text-primary">
                {project.revisionsUsed || 0} /{' '}
                {project.revisionLimit || 0}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-text-muted">
                Video Versions
              </span>

              <span className="text-text-primary">
                {versionCount}
              </span>
            </div>
          </div>

          <div className="card flex flex-col gap-3 p-5">
            <h2 className="text-base font-semibold text-text-primary">
              Assigned Editor
            </h2>

            {project.assignedEditor ? (
              <div className="flex items-center gap-3">
                {project.assignedEditor.avatar?.url ? (
                  <img
                    src={project.assignedEditor.avatar.url}
                    alt={project.assignedEditor.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                    {project.assignedEditor.name
                      ?.charAt(0)
                      .toUpperCase() || 'E'}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {project.assignedEditor.name}
                  </p>

                  <p className="truncate text-xs text-text-muted">
                    {project.assignedEditor.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                No editor assigned yet.
              </p>
            )}
          </div>
        </aside>
      </div>

      <ConfirmModal
        isOpen={showCancelModal}
        title="Cancel this project?"
        message="This will mark the project as cancelled. This action cannot be undone."
        confirmLabel="Yes, cancel project"
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelModal(false)}
      />
    </DashboardLayout>
  );
};

export default ProjectDetails;