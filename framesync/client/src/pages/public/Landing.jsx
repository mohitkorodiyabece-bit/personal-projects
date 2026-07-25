import React from 'react';
import { Link } from 'react-router-dom';
import { Film, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
            F
          </div>
          <span className="text-lg font-semibold text-text-primary">FrameSync</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary">
            Log in
          </Link>
          <Link to="/register" className="btn-primary">
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
          Video editing collaboration,{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            without the chaos
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-text-muted">
          FrameSync connects clients and editors on one portal — share footage, review preview
          cuts with timestamped feedback, request revisions, and approve final deliveries.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Start your project <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 pb-24 sm:grid-cols-3">
        <div className="card p-6">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Film size={20} />
          </div>
          <h3 className="mb-2 text-base font-semibold text-text-primary">Version review</h3>
          <p className="text-sm text-text-muted">
            Watch preview cuts right in the browser and compare versions side by side.
          </p>
        </div>
        <div className="card p-6">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
            <MessageSquare size={20} />
          </div>
          <h3 className="mb-2 text-base font-semibold text-text-primary">Timestamped feedback</h3>
          <p className="text-sm text-text-muted">
            Leave comments tied to the exact moment in the video — no more "at 1:20-ish."
          </p>
        </div>
        <div className="card p-6">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
            <CheckCircle size={20} />
          </div>
          <h3 className="mb-2 text-base font-semibold text-text-primary">Clear approvals</h3>
          <p className="text-sm text-text-muted">
            Track revisions used, request changes, and approve final delivery in one click.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;