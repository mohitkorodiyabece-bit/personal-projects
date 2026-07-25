import React, { useState } from 'react';
import { MessageSquarePlus, Clock } from 'lucide-react';
import { formatTime } from '../../utils/formatTime.js';

const TimestampFeedbackForm = ({ currentTime, onCaptureTime, onSubmit, submitting }) => {
  const [message, setMessage] = useState('');
  const [capturedTime, setCapturedTime] = useState(null);
  const [error, setError] = useState('');

  const handleCapture = () => {
    setCapturedTime(currentTime);
    onCaptureTime?.(currentTime);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!message.trim() || message.trim().length < 2) {
      setError('Feedback message must be at least 2 characters');
      return;
    }

    const timestamp = capturedTime !== null ? capturedTime : currentTime;

    await onSubmit({ message: message.trim(), timestamp });
    setMessage('');
    setCapturedTime(null);
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">Add timestamped feedback</span>
        <button
          type="button"
          onClick={handleCapture}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
        >
          <Clock size={13} />
          Capture {formatTime(currentTime)}
        </button>
      </div>

      {capturedTime !== null && (
        <p className="text-xs text-text-muted">
          Feedback will be linked to{' '}
          <span className="font-medium text-primary">{formatTime(capturedTime)}</span>
        </p>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Describe what you'd like changed at this point in the video..."
        className="input-field resize-none"
        maxLength={1000}
      />
      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary self-end">
        <MessageSquarePlus size={16} />
        {submitting ? 'Posting...' : 'Post feedback'}
      </button>
    </form>
  );
};

export default TimestampFeedbackForm;