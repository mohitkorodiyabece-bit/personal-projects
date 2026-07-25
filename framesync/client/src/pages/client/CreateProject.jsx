import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import { validateProjectForm, isValidUrl } from '../../utils/validators.js';
import { createProject } from '../../services/projectService.js';

const videoTypeOptions = [
  { value: 'youtube', label: 'YouTube Video' },
  { value: 'short_form', label: 'Short-form / Reels' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'music_video', label: 'Music Video' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

const emptyLink = { label: '', url: '' };

const CreateProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: '',
    videoType: 'youtube',
    editingStyle: '',
    priority: 'medium',
    revisionLimit: 3,
  });
  const [rawFileLinks, setRawFileLinks] = useState([{ ...emptyLink }]);
  const [referenceLinks, setReferenceLinks] = useState([{ ...emptyLink }]);
  const [thumbnail, setThumbnail] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateLink = (setter, list, idx, field, value) => {
    const updated = [...list];
    updated[idx] = { ...updated[idx], [field]: value };
    setter(updated);
  };

  const addLinkRow = (setter, list) => setter([...list, { ...emptyLink }]);
  const removeLinkRow = (setter, list, idx) => setter(list.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateProjectForm(form);

    const validRawLinks = rawFileLinks.filter((l) => l.url.trim());
    const validRefLinks = referenceLinks.filter((l) => l.url.trim());

    validRawLinks.forEach((l) => {
      if (!isValidUrl(l.url)) validationErrors.rawFileLinks = 'One or more raw file links are invalid URLs';
    });
    validRefLinks.forEach((l) => {
      if (!isValidUrl(l.url)) validationErrors.referenceLinks = 'One or more reference links are invalid URLs';
    });

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('rawFileLinks', JSON.stringify(validRawLinks));
      formData.append('referenceLinks', JSON.stringify(validRefLinks));
      if (thumbnail) formData.append('thumbnail', thumbnail);

      const response = await createProject(formData);
      toast.success('Project created successfully!');
      navigate(`/client/projects/${response.data.project._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Project" subtitle="Set up a new video editing project">
      <form onSubmit={handleSubmit} noValidate className="card flex flex-col gap-5 p-6">
        <div>
          <label htmlFor="title" className="label-field">
            Project title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. Summer Product Launch Promo"
          />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="label-field">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="input-field resize-none"
            placeholder="Describe what you need — goals, audience, key messages..."
          />
          {errors.description && <p className="error-text">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="deadline" className="label-field">
              Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="input-field"
            />
            {errors.deadline && <p className="error-text">{errors.deadline}</p>}
          </div>

          <div>
            <label htmlFor="budget" className="label-field">
              Budget (USD)
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0"
              step="0.01"
              value={form.budget}
              onChange={handleChange}
              className="input-field"
              placeholder="500"
            />
            {errors.budget && <p className="error-text">{errors.budget}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="videoType" className="label-field">
              Video type
            </label>
            <select
              id="videoType"
              name="videoType"
              value={form.videoType}
              onChange={handleChange}
              className="input-field cursor-pointer"
            >
              {videoTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="label-field">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="input-field cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="editingStyle" className="label-field">
              Editing style
            </label>
            <input
              id="editingStyle"
              name="editingStyle"
              value={form.editingStyle}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Fast-paced, vibrant color grade"
            />
            {errors.editingStyle && <p className="error-text">{errors.editingStyle}</p>}
          </div>

          <div>
            <label htmlFor="revisionLimit" className="label-field">
              Revision limit
            </label>
            <input
              id="revisionLimit"
              name="revisionLimit"
              type="number"
              min="0"
              max="20"
              value={form.revisionLimit}
              onChange={handleChange}
              className="input-field"
            />
            {errors.revisionLimit && <p className="error-text">{errors.revisionLimit}</p>}
          </div>
        </div>

        <FileUpload
          label="Project thumbnail (optional)"
          accept="image/*"
          maxSizeMb={5}
          file={thumbnail}
          onFileSelect={setThumbnail}
          type="image"
        />

        <div>
          <span className="label-field">Raw footage links (Google Drive, Dropbox, etc.)</span>
          <div className="flex flex-col gap-2">
            {rawFileLinks.map((link, idx) => (
              <div key={idx} className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={link.label}
                  onChange={(e) => updateLink(setRawFileLinks, rawFileLinks, idx, 'label', e.target.value)}
                  className="input-field sm:w-40"
                  placeholder="Label"
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(setRawFileLinks, rawFileLinks, idx, 'url', e.target.value)}
                  className="input-field flex-1"
                  placeholder="https://drive.google.com/..."
                />
                {rawFileLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLinkRow(setRawFileLinks, rawFileLinks, idx)}
                    className="btn-secondary shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addLinkRow(setRawFileLinks, rawFileLinks)}
              className="self-start text-sm font-medium text-primary hover:underline"
            >
              + Add another link
            </button>
          </div>
          {errors.rawFileLinks && <p className="error-text">{errors.rawFileLinks}</p>}
        </div>

        <div>
          <span className="label-field">Reference links (optional)</span>
          <div className="flex flex-col gap-2">
            {referenceLinks.map((link, idx) => (
              <div key={idx} className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={link.label}
                  onChange={(e) => updateLink(setReferenceLinks, referenceLinks, idx, 'label', e.target.value)}
                  className="input-field sm:w-40"
                  placeholder="Label"
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(setReferenceLinks, referenceLinks, idx, 'url', e.target.value)}
                  className="input-field flex-1"
                  placeholder="https://youtube.com/..."
                />
                {referenceLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLinkRow(setReferenceLinks, referenceLinks, idx)}
                    className="btn-secondary shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addLinkRow(setReferenceLinks, referenceLinks)}
              className="self-start text-sm font-medium text-primary hover:underline"
            >
              + Add another link
            </button>
          </div>
          {errors.referenceLinks && <p className="error-text">{errors.referenceLinks}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-2 self-start">
          <Save size={16} />
          {loading ? 'Creating project...' : 'Create project'}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default CreateProject;