import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/15 text-danger">
        <ShieldAlert size={30} />
      </div>
      <h1 className="text-2xl font-semibold text-text-primary">Access denied</h1>
      <p className="max-w-sm text-sm text-text-muted">
        You don&apos;t have permission to view this page. If you believe this is a mistake,
        contact an administrator.
      </p>
      <Link to="/" className="btn-primary mt-2">
        Back to home
      </Link>
    </div>
  );
};

export default Unauthorized;