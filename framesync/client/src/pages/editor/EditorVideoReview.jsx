import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileText, UploadCloud } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import VideoPlayer from '../../components/video/VideoPlayer.jsx';
import FeedbackList from '../../components/feedback/FeedbackList.jsx';
import { getProjectById } from '../../services/projectService.js';
import { getVersions } from '../../services/versionService.js';
import { getFeedback, resolveFeedback } from '../../services/feedbackService.js';
import { formatTime } from '../../utils/formatTime.js';
import { formatDateTime } from '../../utils/formatDate.js';
import useAuth from '../../hooks/useAuth.js';

const EditorVideoReview = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const videoRef = useRef(null);

  const [project, setProject] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeVersion, setActiveVersion] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    await fetchFeedback(version._id);
  };

  const handleSeek = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play().catch(() => {});
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

  if (loading) return <LoadingSpinner fullScreen label="Loading review..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!project) return null;

  if (versions.length === 0) {
    return (
      <DashboardLayout title={`Review: ${project.title}`}>
        <EmptyState
          title="No versions uploaded yet"
          message="Upload a preview version so the client can leave feedback."
          action={
            <Link to={`/editor/projects/${id}/upload`} className="btn-primary">
              <UploadCloud size={16} /> Upload Version
            </Link>
          }
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Review: ${project.title}`}
      subtitle={`Version ${activeVersion?.versionNumber} of ${versions.length} · Uploaded ${formatDateTime(
        activeVersion?.createdAt
      )}`}
      actions={
        <Link to={`/editor/projects/${id}/upload`} className="btn-primary">
          <UploadCloud size={16} /> Upload New Version
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <VideoPlayer ref={videoRef} src={activeVersion?.videoUrl} />

          {activeVersion?.notes && (
            <div className="card flex gap-2 p-4">
              <FileText size={16} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Version notes</p>
                <p className="mt-1 text-sm text-text-muted">{activeVersion.notes}</p>
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-3 text-base font-semibold text-text-primary">
              Client Feedback ({feedback.length})
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditorVideoReview;