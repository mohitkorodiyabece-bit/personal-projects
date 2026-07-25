import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import useAuth from '../../hooks/useAuth.js';
import { updateProfile } from '../../services/userService.js';

const ProfileSettings = () => {
  const { user, updateStoredUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <DashboardLayout title="Profile Settings" subtitle="Manage your account information">
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
            placeholder="Tell us a bit about yourself..."
            maxLength={500}
          />
          {errors.bio && <p className="error-text">{errors.bio}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary self-start">
          <Save size={16} />
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default ProfileSettings;