import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, RefreshCw, FileText } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import VideoPlayer from '../../components/video/VideoPlayer.jsx';
import TimestampFeedbackForm from '../../components/feedback/TimestampFeedbackForm.jsx';
import FeedbackList from '../../components/feedback/FeedbackList.jsx';
import { getProjectById, updateProjectStatus, approveProject } from '../../services/projectService.js';
import { getVersions } from '../../services/versionService.js';
import { getFeedback, createFeedback, resolveFeedback } from '../../services/feedbackService.js';
import { formatTime } from '../../utils/formatTime.js';
import { formatDateTime } from '../../utils/formatDate.js';
import useAuth from '../../hooks/useAuth.js';

const VideoReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);

  const [project, setProject] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeVersion, setActiveVersion] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchFeedback = useCallback(async (versionId) => {
    if (!versionId) return;
    try {
      const res = await getFeedback(versionId);
      setFeedback(res.data.feedback);
    } catch {
      setFeedback([]);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [projectRes, versionsRes] = await Promise.all([
        getProjectById(id),
        getVersions(id),
      ]);
      setProject(projectRes.data.project);
      const sortedVersions = versionsRes.data.versions;
      setVersions(sortedVersions);

      if (sortedVersions.length > 0) {
        const latest = sortedVersions[0];
        setActiveVersion(latest);
        await fetchFeedback(latest._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load review data');
    } finally {
      setLoading(false);
    }
  }, [id, fetchFeedback]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectVersion = async (version) => {
    setActiveVersion(version);
    setCurrentTime(0);
    await fetchFeedback(version._id);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleSubmitFeedback = async ({ message, timestamp }) => {
    if (!activeVersion) return;
    setSubmittingFeedback(true);
    try {
      await createFeedback(activeVersion._id, { message, timestamp });
      toast.success('Feedback posted');
      await fetchFeedback(activeVersion._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleResolve = async (feedbackId) => {
    try {
      await resolveFeedback(feedbackId);
      toast.success('Feedback marked resolved');
      if (activeVersion) await fetchFeedback(activeVersion._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve feedback');
    }
  };

  const handleRequestRevision = async () => {
    setActionLoading(true);
    try {
      await updateProjectStatus(id, 'revision_requested');
      toast.success('Revision requested');
      setShowRevisionModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request revision');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await approveProject(id);
      toast.success('Project approved and marked completed!');
      setShowApproveModal(false);
      navigate(`/client/projects/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve project');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading review..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!project) return null;

  if (versions.length === 0) {
    return (
      <DashboardLayout title={`Review: ${project.title}`}>
        <EmptyState
          title="No preview versions yet"
          message="Your editor hasn't uploaded a preview version to review yet. Check back soon."
        />
      </DashboardLayout>
    );
  }

  const canApproveOrRevise =
    project.status === 'final_ready' ||
    project.status === 'preview_ready' ||
    project.status === 'client_review';
  const revisionsExhausted = project.revisionsUsed >= project.revisionLimit;

  return (
    <DashboardLayout
      title={`Review: ${project.title}`}
      subtitle={`Version ${activeVersion?.versionNumber} of ${versions.length} · Uploaded ${formatDateTime(
        activeVersion?.createdAt
      )}`}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <VideoPlayer
            ref={videoRef}
            src={activeVersion?.videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
          />

          {activeVersion?.notes && (
            <div className="card flex gap-2 p-4">
              <FileText size={16} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Version notes</p>
                <p className="mt-1 text-sm text-text-muted">{activeVersion.notes}</p>
              </div>
            </div>
          )}

          <TimestampFeedbackForm
            currentTime={currentTime}
            onSubmit={handleSubmitFeedback}
            submitting={submittingFeedback}
          />

          <div>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              Feedback ({feedback.length})
            </h2>
            <FeedbackList
              feedback={feedback}
              onSeek={handleSeek}
              onResolve={handleResolve}
              currentUserId={user?._id}
              canResolve
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card p-5">
            <h2 className="mb-3 text-base font-semibold text-text-primary">Versions</h2>
            <div className="flex flex-col gap-2">
              {versions.map((v) => (
                <button
                  key={v._id}
                  type="button"
                  onClick={() => handleSelectVersion(v)}
                  className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors ${
                    activeVersion?._id === v._id
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border text-text-muted hover:bg-surface-secondary'
                  }`}
                >
                  <span>Version {v.versionNumber}</span>
                  <span className="text-xs">{formatTime(v.duration)}</span>
                </button>
              ))}
            </div>
          </div>

          {canApproveOrRevise && (
            <div className="card flex flex-col gap-3 p-5">
              <h2 className="text-base font-semibold text-text-primary">Decision</h2>
              <p className="text-xs text-text-muted">
                Revisions used: {project.revisionsUsed} / {project.revisionLimit}
              </p>
              <button
                type="button"
                onClick={() => setShowApproveModal(true)}
                className="btn-primary w-full"
                disabled={project.status !== 'final_ready'}
              >
                <CheckCircle size={16} />
                Approve {project.status === 'final_ready' ? 'Final Video' : '(awaiting final delivery)'}
              </button>
              <button
                type="button"
                onClick={() => setShowRevisionModal(true)}
                className="btn-secondary w-full"
                disabled={revisionsExhausted}
              >
                <RefreshCw size={16} />
                {revisionsExhausted ? 'Revision limit reached' : 'Request Revision'}
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showRevisionModal}
        title="Request a revision?"
        message="This will notify your editor that changes are needed based on your feedback above."
        confirmLabel="Request revision"
        loading={actionLoading}
        onConfirm={handleRequestRevision}
        onCancel={() => setShowRevisionModal(false)}
      />

      <ConfirmModal
        isOpen={showApproveModal}
        title="Approve final video?"
        message="This will mark the project as completed. This action cannot be undone."
        confirmLabel="Approve & complete"
        loading={actionLoading}
        onConfirm={handleApprove}
        onCancel={() => setShowApproveModal(false)}
      />
    </DashboardLayout>
  );
};

export default VideoReview;