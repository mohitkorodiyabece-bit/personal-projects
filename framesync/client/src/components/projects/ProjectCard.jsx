import React from 'react';
import { Link } from 'react-router-dom';
import { Video, DollarSign } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';
import PriorityBadge from '../common/PriorityBadge.jsx';
import DeadlineDisplay from './DeadlineDisplay.jsx';

const ProjectCard = ({ project, basePath }) => {
  return (
    <Link
      to={`${basePath}/${project._id}`}
      className="card group flex flex-col overflow-hidden transition-all duration-150 hover:border-primary/40 hover:shadow-glow"
    >
      <div className="relative h-36 w-full overflow-hidden bg-surface-secondary">
        {project.thumbnail?.url ? (
          <img
            src={project.thumbnail.url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Video className="text-text-muted" size={32} />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-text-primary">
            {project.title}
          </h3>
          <PriorityBadge priority={project.priority} />
        </div>

        <p className="line-clamp-2 text-xs text-text-muted">{project.description}</p>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <DeadlineDisplay deadline={project.deadline} status={project.status} />
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <DollarSign size={12} />
            {project.budget}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;