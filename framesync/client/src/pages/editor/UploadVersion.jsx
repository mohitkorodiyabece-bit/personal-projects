import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import { uploadVersion } from '../../services/versionService.js';

const UploadVersion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!video) {
      setError('Please select a video file to upload');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', video);
      formData.append('notes', notes.trim());

      await uploadVersion(id, formData);
      toast.success('Video version uploaded successfully');
      navigate(`/editor/projects/${id}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to upload video version';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Upload Version" subtitle="Upload a new preview video for client review">
      <form onSubmit={handleSubmit} noValidate className="card flex max-w-2xl flex-col gap-5 p-6">
        <FileUpload
          label="Preview video (MP4, MOV, WEBM, MKV — max 100MB)"
          accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
          maxSizeMb={100}
          file={video}
          onFileSelect={setVideo}
          type="video"
          error={error}
        />

        <div>
          <label htmlFor="notes" className="label-field">
            Version notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder="What changed in this version? What should the client focus on?"
            maxLength={2000}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary self-start">
          <UploadCloud size={16} />
          {loading ? 'Uploading...' : 'Upload version'}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default UploadVersion;