'use client';

import { useState } from 'react';
import { PollManagementModal } from './PollManagementModal';

interface Poll {
  id: number;
  title: string;
  description: string;
  status: number; // 0=Draft, 1=Frozen, 2=Published, 3=Canceled
  pollStatus?: number; // 0=Active, 1=Closed, 2=Anchored (only if published)
  startTs: number;
  endTs: number;
  invitesTotal: number;
  invitesRedeemed: number;
  bindingsCount: number;
  votesCount: number;
  createdBy: string;
  createdAt: string;
  optionsJson: Array<{
    idx: number;
    label: string;
    description?: string;
    mediaUri?: string;
  }>;
}

interface PollsTableProps {
  initialPolls: Poll[];
}

export function PollsTable({ initialPolls }: PollsTableProps) {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Filter polls based on active tab
  const filteredPolls = polls.filter((poll) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'drafts') return poll.status === 0;
    if (activeTab === 'frozen') return poll.status === 1;
    if (activeTab === 'published') return poll.status === 2;
    if (activeTab === 'canceled') return poll.status === 3;
    return true;
  });

  const getStatusBadge = (status: number) => {
    const badges = {
      0: <span className="badge badge-ghost">Draft</span>,
      1: <span className="badge badge-info">Frozen</span>,
      2: <span className="badge badge-success">Published</span>,
      3: <span className="badge badge-error">Canceled</span>,
    };
    return badges[status as keyof typeof badges] || <span className="badge">Unknown</span>;
  };

  const getPollStatusBadge = (pollStatus?: number) => {
    if (pollStatus === undefined) return null;
    const badges = {
      0: <span className="badge badge-success">Active</span>,
      1: <span className="badge badge-warning">Closed</span>,
      2: <span className="badge badge-primary">Anchored</span>,
    };
    return badges[pollStatus as keyof typeof badges] || null;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleManagePoll = (poll: Poll) => {
    setSelectedPoll(poll);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPoll(null);
  };

  return (
    <>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          {/* Tabs for Filtering */}
          <div className="tabs tabs-boxed mb-4">
            <a 
              className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Polls
              <span className="badge badge-sm ml-2">{polls.length}</span>
            </a>
            <a 
              className={`tab ${activeTab === 'drafts' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              Drafts
              <span className="badge badge-sm ml-2">
                {polls.filter(p => p.status === 0).length}
              </span>
            </a>
            <a 
              className={`tab ${activeTab === 'frozen' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('frozen')}
            >
              Frozen
              <span className="badge badge-sm ml-2">
                {polls.filter(p => p.status === 1).length}
              </span>
            </a>
            <a 
              className={`tab ${activeTab === 'published' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('published')}
            >
              Published
              <span className="badge badge-sm ml-2">
                {polls.filter(p => p.status === 2).length}
              </span>
            </a>
            <a 
              className={`tab ${activeTab === 'canceled' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('canceled')}
            >
              Canceled
              <span className="badge badge-sm ml-2">
                {polls.filter(p => p.status === 3).length}
              </span>
            </a>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="table table-zebra table-pin-rows">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Poll Status</th>
                  <th>Timeline</th>
                  <th>Invites</th>
                  <th>Registered</th>
                  <th>Votes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolls.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-base-content/70">No polls found</p>
                        <button className="btn btn-primary btn-sm mt-2">Create Your First Poll</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPolls.map((poll) => (
                    <tr key={poll.id} className="hover">
                      <td className="font-mono font-bold">#{poll.id}</td>
                      <td>
                        <div className="max-w-xs">
                          <div className="font-semibold truncate">{poll.title}</div>
                          <div className="text-sm text-base-content/70 truncate">
                            {poll.description}
                          </div>
                        </div>
                      </td>
                      <td>{getStatusBadge(poll.status)}</td>
                      <td>{getPollStatusBadge(poll.pollStatus)}</td>
                      <td className="text-sm">
                        <div>Start: {formatDate(poll.startTs)}</div>
                        <div>End: {formatDate(poll.endTs)}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{poll.invitesRedeemed}</span>
                          <span className="text-base-content/70">/ {poll.invitesTotal}</span>
                        </div>
                        <progress 
                          className="progress progress-primary w-20" 
                          value={poll.invitesRedeemed} 
                          max={poll.invitesTotal}
                        ></progress>
                      </td>
                      <td className="font-semibold">{poll.bindingsCount}</td>
                      <td>
                        {poll.status === 2 ? (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{poll.votesCount}</span>
                            {poll.bindingsCount > 0 && (
                              <span className="text-xs text-base-content/70">
                                ({Math.round((poll.votesCount / poll.bindingsCount) * 100)}%)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-base-content/50">—</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-horizontal">
                          <button 
                            className="btn btn-sm btn-ghost"
                            onClick={() => handleManagePoll(poll)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleManagePoll(poll)}
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredPolls.length === 0 ? (
              <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-base-content/70">No polls found</p>
                  <button className="btn btn-primary btn-sm mt-2">Create Your First Poll</button>
                </div>
              </div>
            ) : (
              filteredPolls.map((poll) => (
                <div key={poll.id} className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <h3 className="card-title text-lg">{poll.title}</h3>
                      <span className="font-mono font-bold text-sm">#{poll.id}</span>
                    </div>
                    
                    <p className="text-sm text-base-content/70">{poll.description}</p>
                    
                    <div className="flex gap-2 flex-wrap">
                      {getStatusBadge(poll.status)}
                      {getPollStatusBadge(poll.pollStatus)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-base-content/70">Invites:</span>
                        <span className="font-semibold ml-1">
                          {poll.invitesRedeemed} / {poll.invitesTotal}
                        </span>
                      </div>
                      <div>
                        <span className="text-base-content/70">Registered:</span>
                        <span className="font-semibold ml-1">{poll.bindingsCount}</span>
                      </div>
                      {poll.status === 2 && (
                        <div>
                          <span className="text-base-content/70">Votes:</span>
                          <span className="font-semibold ml-1">{poll.votesCount}</span>
                        </div>
                      )}
                    </div>

                    <div className="card-actions justify-end">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleManagePoll(poll)}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Poll Management Modal */}
      {showModal && selectedPoll && (
        <PollManagementModal 
          poll={selectedPoll} 
          onClose={handleCloseModal}
          onUpdate={(updatedPoll) => {
            setPolls(polls.map(p => p.id === updatedPoll.id ? updatedPoll : p));
            handleCloseModal();
          }}
        />
      )}
    </>
  );
}

