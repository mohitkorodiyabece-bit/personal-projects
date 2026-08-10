import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';
import PriorityBadge from '../common/PriorityBadge.jsx';
import { formatDate } from '../../utils/formatDate.js';

const ProjectTable = ({ projects, basePath, showClient = false, showEditor = false }) => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/50 text-xs uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              {showClient && <th className="px-4 py-3 font-medium">Client</th>}
              {showEditor && <th className="px-4 py-3 font-medium">Editor</th>}
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Deadline</th>
              <th className="px-4 py-3 font-medium">Budget</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project._id}
                className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
              >
                <td className="max-w-[220px] truncate px-4 py-3 font-medium text-text-primary">
                  {project.title}
                </td>
                {showClient && (
                  <td className="px-4 py-3 text-text-muted">
                    {project.client?.name || '—'}
                  </td>
                )}
                {showEditor && (
                  <td className="px-4 py-3 text-text-muted">
                    {project.assignedEditor?.name || 'Unassigned'}
                  </td>
                )}
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={project.priority} />
                </td>
                <td className="px-4 py-3 text-text-muted">{formatDate(project.deadline)}</td>
                <td className="px-4 py-3 text-text-muted">${project.budget}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`${basePath}/${project._id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Eye size={14} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;