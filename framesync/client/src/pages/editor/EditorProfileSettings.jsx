import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, X, Plus } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import useAuth from '../../hooks/useAuth.js';
import { updateProfile } from '../../services/userService.js';

const EditorProfileSettings = () => {
  const { user, updateStoredUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      validationErrors.name = 'Name must be at least 2 characters';
    }
    if (form.bio.length > 500) {
      validationErrors.bio = 'Bio cannot exceed 500 characters';
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('bio', form.bio.trim());
      skills.forEach((skill) => formData.append('skills', skill));
      if (avatar) formData.append('avatar', avatar);

      const response = await updateProfile(formData);
      updateStoredUser(response.data.user);
      toast.success('Profile updated successfully');
      setAvatar(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Profile Settings" subtitle="Manage your editor profile">
      <form onSubmit={handleSubmit} noValidate className="card flex max-w-xl flex-col gap-5 p-6">
        <div className="flex items-center gap-4">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-xl font-semibold text-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">{user?.email}</p>
            <p className="text-xs capitalize text-text-muted">{user?.role} account</p>
          </div>
        </div>

        <FileUpload
          label="Profile picture"
          accept="image/*"
          maxSizeMb={5}
          file={avatar}
          onFileSelect={setAvatar}
          type="image"
        />

        <div>
          <label htmlFor="name" className="label-field">
            Full name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="bio" className="label-field">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="input-field resize-none"
            placeholder="Tell clients about your editing experience..."
            maxLength={500}
          />
          {errors.bio && <p className="error-text">{errors.bio}</p>}
        </div>

        <div>
          <span className="label-field">Skills</span>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              className="input-field"
              placeholder="e.g. Premiere Pro"
            />
            <button type="button" onClick={addSkill} className="btn-secondary shrink-0">
              <Plus size={16} />
            </button>
          </div>
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary self-start">
          <Save size={16} />
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default EditorProfileSettings;