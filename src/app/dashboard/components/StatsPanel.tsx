'use client';

interface StatsPanelProps {
  stats: {
    totalPolls: number;
    activePolls: number;
    totalVotes: number;
    pendingInvites: number;
  };
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full bg-base-200">
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="stat-title">Total Polls</div>
        <div className="stat-value text-primary">{stats.totalPolls}</div>
        <div className="stat-desc">All time created</div>
      </div>
      
      <div className="stat">
        <div className="stat-figure text-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="stat-title">Active Polls</div>
        <div className="stat-value text-success">{stats.activePolls}</div>
        <div className="stat-desc">Currently accepting votes</div>
      </div>
      
      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <div className="stat-title">Total Votes</div>
        <div className="stat-value text-secondary">{stats.totalVotes.toLocaleString()}</div>
        <div className="stat-desc">Across all polls</div>
      </div>
      
      <div className="stat">
        <div className="stat-figure text-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="stat-title">Pending Invites</div>
        <div className="stat-value text-warning">{stats.pendingInvites}</div>
        <div className="stat-desc">Awaiting redemption</div>
      </div>
    </div>
  );
}

