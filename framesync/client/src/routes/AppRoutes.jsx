import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Landing from '../pages/public/Landing.jsx';
import Login from '../pages/public/Login.jsx';
import Register from '../pages/public/Register.jsx';
import Unauthorized from '../pages/public/Unauthorized.jsx';
import NotFound from '../pages/public/NotFound.jsx';

import ClientDashboard from '../pages/client/ClientDashboard.jsx';
import MyProjects from '../pages/client/MyProjects.jsx';
import CreateProject from '../pages/client/CreateProject.jsx';
import ProjectDetails from '../pages/client/ProjectDetails.jsx';
import VideoReview from '../pages/client/VideoReview.jsx';
import Notifications from '../pages/client/Notifications.jsx';
import ProfileSettings from '../pages/client/ProfileSettings.jsx';

import EditorDashboard from '../pages/editor/EditorDashboard.jsx';
import AssignedProjects from '../pages/editor/AssignedProjects.jsx';
import ProjectWorkspace from '../pages/editor/ProjectWorkspace.jsx';
import UploadVersion from '../pages/editor/UploadVersion.jsx';
import EditorVideoReview from '../pages/editor/EditorVideoReview.jsx';
import EditorNotifications from '../pages/editor/EditorNotifications.jsx';
import EditorProfileSettings from '../pages/editor/EditorProfileSettings.jsx';

import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import UserManagement from '../pages/admin/UserManagement.jsx';
import ProjectManagement from '../pages/admin/ProjectManagement.jsx';
import EditorAssignment from '../pages/admin/EditorAssignment.jsx';

import AppLayout from '../layouts/AppLayout.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import RoleRoute from '../components/common/RoleRoute.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['client']} />}>
          <Route element={<AppLayout />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/projects" element={<MyProjects />} />
            <Route path="/client/projects/new" element={<CreateProject />} />
            <Route path="/client/projects/:id" element={<ProjectDetails />} />
            <Route path="/client/projects/:id/review" element={<VideoReview />} />
            <Route path="/client/notifications" element={<Notifications />} />
            <Route path="/client/profile" element={<ProfileSettings />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={['editor']} />}>
          <Route element={<AppLayout />}>
            <Route path="/editor/dashboard" element={<EditorDashboard />} />
            <Route path="/editor/projects" element={<AssignedProjects />} />
            <Route path="/editor/projects/:id" element={<ProjectWorkspace />} />
            <Route path="/editor/projects/:id/upload" element={<UploadVersion />} />
            <Route path="/editor/projects/:id/review" element={<EditorVideoReview />} />
            <Route path="/editor/notifications" element={<EditorNotifications />} />
            <Route path="/editor/profile" element={<EditorProfileSettings />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/projects" element={<ProjectManagement />} />
            <Route path="/admin/assign" element={<EditorAssignment />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;