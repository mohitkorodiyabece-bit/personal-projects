import React, { useRef, useState } from 'react';
import { Upload, X, FileVideo, Image as ImageIcon } from 'lucide-react';

const FileUpload = ({
  label = 'Upload file',
  accept = 'image/*',
  maxSizeMb = 5,
  file,
  onFileSelect,
  type = 'image',
  error = '',
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [localError, setLocalError] = useState('');

  const handleFile = (selectedFile) => {
    setLocalError('');
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMb * 1024 * 1024) {
      setLocalError(`File must be smaller than ${maxSizeMb}MB`);
      return;
    }

    onFileSelect(selectedFile);

    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    setPreviewUrl(null);
    setLocalError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayError = error || localError;

  return (
    <div>
      <label className="label-field">{label}</label>

      {!file && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-secondary px-4 py-8 text-center transition-colors hover:border-primary/50"
        >
          <Upload className="text-text-muted" size={22} />
          <span className="text-sm text-text-muted">
            Click to select {type === 'video' ? 'a video' : 'an image'} (max {maxSizeMb}MB)
          </span>
        </button>
      )}

      {file && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary px-4 py-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {type === 'image' && previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-10 w-10 rounded-lg object-cover" />
            ) : type === 'video' ? (
              <FileVideo className="text-primary" size={22} />
            ) : (
              <ImageIcon className="text-primary" size={22} />
            )}
            <span className="truncate text-sm text-text-primary">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-danger"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {displayError && <p className="error-text">{displayError}</p>}
    </div>
  );
};

export default FileUpload;