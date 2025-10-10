'use client';

import { useState } from 'react';

interface Poll {
  id: number;
  title: string;
  description: string;
  status: number;
  pollStatus?: number;
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

interface PollManagementModalProps {
  poll: Poll;
  onClose: () => void;
  onUpdate: (poll: Poll) => void;
}

export function PollManagementModal({ poll, onClose, onUpdate }: PollManagementModalProps) {
  const [activeSection, setActiveSection] = useState<string>('details');
  const [editedPoll, setEditedPoll] = useState<Poll>(poll);
  const [isEditing, setIsEditing] = useState(false);

  const canEdit = poll.status === 0; // Only drafts can be edited

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const truncateAddress = (address: string, chars = 10) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  const handleSave = () => {
    onUpdate(editedPoll);
    setIsEditing(false);
  };

  const getCurrentTime = () => Math.floor(Date.now() / 1000);
  const isPollActive = poll.status === 2 && getCurrentTime() >= poll.startTs && getCurrentTime() <= poll.endTs;
  const isPollEnded = poll.status === 2 && getCurrentTime() > poll.endTs;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl h-[90vh] flex flex-col p-0">
        {/* Modal Header */}
        <div className="sticky top-0 bg-base-200 p-6 border-b border-base-300 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Manage Poll #{poll.id}</h2>
              <p className="text-base-content/70 mt-1">{poll.title}</p>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-base-200 px-6 border-b border-base-300">
          <div className="tabs tabs-boxed bg-transparent">
            <a 
              className={`tab ${activeSection === 'details' ? 'tab-active' : ''}`}
              onClick={() => setActiveSection('details')}
            >
              Poll Details
            </a>
            <a 
              className={`tab ${activeSection === 'invites' ? 'tab-active' : ''}`}
              onClick={() => setActiveSection('invites')}
            >
              Invites & Allowlist
            </a>
            {poll.status === 1 && (
              <a 
                className={`tab ${activeSection === 'publish' ? 'tab-active' : ''}`}
                onClick={() => setActiveSection('publish')}
              >
                Publish
              </a>
            )}
            {isPollActive && (
              <a 
                className={`tab ${activeSection === 'monitoring' ? 'tab-active' : ''}`}
                onClick={() => setActiveSection('monitoring')}
              >
                Live Monitoring
              </a>
            )}
            {isPollEnded && poll.pollStatus !== 2 && (
              <a 
                className={`tab ${activeSection === 'finalize' ? 'tab-active' : ''}`}
                onClick={() => setActiveSection('finalize')}
              >
                Finalize
              </a>
            )}
            {poll.pollStatus === 2 && (
              <a 
                className={`tab ${activeSection === 'results' ? 'tab-active' : ''}`}
                onClick={() => setActiveSection('results')}
              >
                Results
              </a>
            )}
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Poll Details Section */}
          {activeSection === 'details' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Poll Information</h3>
                {canEdit && !isEditing && (
                  <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
                    Edit Poll
                  </button>
                )}
                {isEditing && (
                  <div className="btn-group">
                    <button className="btn btn-success btn-sm" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={editedPoll.title}
                    onChange={(e) => setEditedPoll({...editedPoll, title: e.target.value})}
                  />
                ) : (
                  <div className="text-lg">{poll.title}</div>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                {isEditing ? (
                  <textarea 
                    className="textarea textarea-bordered h-24" 
                    value={editedPoll.description}
                    onChange={(e) => setEditedPoll({...editedPoll, description: e.target.value})}
                  ></textarea>
                ) : (
                  <div className="text-base-content/80">{poll.description}</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Start Time</span>
                  </label>
                  <div className="font-mono text-sm">{formatDate(poll.startTs)}</div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">End Time</span>
                  </label>
                  <div className="font-mono text-sm">{formatDate(poll.endTs)}</div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Options</span>
                </label>
                <div className="space-y-2">
                  {poll.optionsJson.map((option) => (
                    <div key={option.idx} className="card bg-base-200">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="badge badge-primary">{option.idx}</div>
                          <div className="flex-1">
                            <div className="font-semibold">{option.label}</div>
                            {option.description && (
                              <div className="text-sm text-base-content/70 mt-1">
                                {option.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="divider"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Created By</span>
                  </label>
                  <div className="font-mono text-sm bg-base-200 p-2 rounded">
                    {poll.createdBy}
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Created At</span>
                  </label>
                  <div className="text-sm">{new Date(poll.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {canEdit && (
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Draft Mode</h3>
                    <div className="text-sm">This poll can still be edited. Freeze the allowlist to lock changes.</div>
                  </div>
                </div>
              )}

              {poll.status === 3 && (
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>This poll has been canceled.</span>
                </div>
              )}

              {canEdit && (
                <div className="card-actions justify-end gap-2">
                  <button className="btn btn-error btn-outline">Cancel Poll</button>
                  <button className="btn btn-ghost">Delete Draft</button>
                </div>
              )}
            </div>
          )}

          {/* Invites & Allowlist Section */}
          {activeSection === 'invites' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Invites & Allowlist Management</h3>

              {/* Sub-tabs */}
              <div className="tabs tabs-lifted">
                <a className="tab tab-active">Upload Emails</a>
                <a className="tab">Issued Invites ({poll.invitesTotal})</a>
                <a className="tab">Registered Users ({poll.bindingsCount})</a>
              </div>

              {/* Upload Emails */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title">Upload Email Allowlist</h4>
                  <p className="text-sm text-base-content/70">
                    Upload a CSV or TXT file with email addresses, or paste them directly
                  </p>

                  {canEdit ? (
                    <>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Upload File</span>
                        </label>
                        <input type="file" className="file-input file-input-bordered" accept=".csv,.txt" />
                      </div>

                      <div className="divider">OR</div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Paste Email Addresses</span>
                        </label>
                        <textarea 
                          className="textarea textarea-bordered h-32" 
                          placeholder="one@example.com&#10;two@example.com&#10;three@example.com"
                        ></textarea>
                      </div>

                      <div className="card-actions justify-end">
                        <button className="btn btn-primary">Generate Invites</button>
                      </div>
                    </>
                  ) : (
                    <div className="alert alert-info">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Allowlist is frozen. No new invites can be generated.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Progress */}
              <div className="stats shadow w-full">
                <div className="stat">
                  <div className="stat-title">Total Invites</div>
                  <div className="stat-value text-primary">{poll.invitesTotal}</div>
                  <div className="stat-desc">Generated invitation links</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Redeemed</div>
                  <div className="stat-value text-success">{poll.invitesRedeemed}</div>
                  <div className="stat-desc">Users who claimed invite</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Registered Wallets</div>
                  <div className="stat-value text-secondary">{poll.bindingsCount}</div>
                  <div className="stat-desc">Ready to vote</div>
                </div>
              </div>

              {poll.status === 0 && poll.bindingsCount > 0 && (
                <div className="card bg-primary text-primary-content">
                  <div className="card-body">
                    <h4 className="card-title">Ready to Freeze Allowlist</h4>
                    <p className="text-sm">
                      You have {poll.bindingsCount} registered users. Freezing the allowlist will:
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Lock the poll configuration (no more edits)</li>
                      <li>Build the Merkle tree from registered wallets</li>
                      <li>Generate proposal.json and pin to IPFS</li>
                      <li>Compute the eligibleRoot hash</li>
                      <li>Prepare the poll for blockchain publishing</li>
                    </ul>
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Freeze Allowlist
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Publish to Blockchain Section */}
          {activeSection === 'publish' && poll.status === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Publish Poll to Blockchain</h3>

              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Publishing to blockchain requires wallet connection and gas fees.</span>
              </div>

              <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div className="stat">
                  <div className="stat-title">Eligible Voters</div>
                  <div className="stat-value text-primary">{poll.bindingsCount}</div>
                  <div className="stat-desc">Registered wallets</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Poll Duration</div>
                  <div className="stat-value text-sm">
                    {Math.round((poll.endTs - poll.startTs) / 86400)} days
                  </div>
                  <div className="stat-desc">{formatDate(poll.startTs)} - {formatDate(poll.endTs)}</div>
                </div>
              </div>

              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title">Blockchain Parameters</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Eligible Root (Merkle Root)</span>
                      </label>
                      <div className="font-mono text-xs bg-base-300 p-3 rounded break-all">
                        0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
                      </div>
                      <div className="text-xs text-base-content/70 mt-1">
                        Computed from {poll.bindingsCount} registered wallet addresses
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Proposal IPFS CID</span>
                      </label>
                      <div className="font-mono text-xs bg-base-300 p-3 rounded break-all">
                        bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
                      </div>
                      <a href="#" className="link link-primary text-xs">View on IPFS Gateway</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-success text-success-content">
                <div className="card-body">
                  <h4 className="card-title">Ready to Publish</h4>
                  <p className="text-sm">
                    This will call the smart contract <code className="bg-success-content/20 px-1 rounded">createPoll()</code> function with the following parameters:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>Poll ID: {poll.id}</li>
                    <li>Eligible Root: 0x1234...cdef</li>
                    <li>Start Timestamp: {poll.startTs}</li>
                    <li>End Timestamp: {poll.endTs}</li>
                    <li>Metadata URI: bafy...bzdi</li>
                  </ul>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-warning">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Publish to Blockchain
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Monitoring Section */}
          {activeSection === 'monitoring' && isPollActive && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Live Poll Monitoring</h3>

              <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div className="stat">
                  <div className="stat-title">Votes Cast</div>
                  <div className="stat-value text-primary">{poll.votesCount}</div>
                  <div className="stat-desc">
                    {poll.bindingsCount > 0 && 
                      `${Math.round((poll.votesCount / poll.bindingsCount) * 100)}% turnout`
                    }
                  </div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Participation Rate</div>
                  <div className="stat-value text-success">
                    {poll.bindingsCount > 0 
                      ? Math.round((poll.votesCount / poll.bindingsCount) * 100)
                      : 0}%
                  </div>
                  <progress 
                    className="progress progress-success" 
                    value={poll.votesCount} 
                    max={poll.bindingsCount}
                  ></progress>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Time Remaining</div>
                  <div className="stat-value text-warning countdown">
                    <span style={{'--value': 15} as React.CSSProperties}></span>h
                    <span style={{'--value': 42} as React.CSSProperties}></span>m
                  </div>
                  <div className="stat-desc">Ends {formatDate(poll.endTs)}</div>
                </div>
              </div>

              {/* Live Tally Chart */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title">Live Vote Distribution</h4>
                  <div className="space-y-3">
                    {poll.optionsJson.map((option, idx) => {
                      const mockVotes = [45, 28, 22][idx] || 0; // Mock data
                      const percentage = poll.votesCount > 0 ? (mockVotes / poll.votesCount) * 100 : 0;
                      return (
                        <div key={option.idx}>
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold">{option.label}</span>
                            <span className="text-base-content/70">
                              {mockVotes} votes ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <progress 
                            className={`progress ${idx === 0 ? 'progress-primary' : idx === 1 ? 'progress-secondary' : 'progress-accent'}`}
                            value={percentage} 
                            max={100}
                          ></progress>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Votes */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title">Recent Votes</h4>
                  <div className="overflow-x-auto">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Wallet</th>
                          <th>Option</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-mono text-xs">0x742d...f0bEb</td>
                          <td><span className="badge badge-primary badge-sm">Option 0</span></td>
                          <td className="text-xs">2 minutes ago</td>
                        </tr>
                        <tr>
                          <td className="font-mono text-xs">0x8a3c...2d9Ac</td>
                          <td><span className="badge badge-secondary badge-sm">Option 1</span></td>
                          <td className="text-xs">5 minutes ago</td>
                        </tr>
                        <tr>
                          <td className="font-mono text-xs">0x5f2e...8c1Bd</td>
                          <td><span className="badge badge-primary badge-sm">Option 0</span></td>
                          <td className="text-xs">8 minutes ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Audit Chain Info */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title">Audit Chain Status</h4>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Current Tip Hash</div>
                      <div className="font-mono text-xs">0xabcd...789f</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Sequence Count</div>
                      <div className="stat-value text-sm">{poll.votesCount}</div>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm mt-2">View Full Audit Log</button>
                </div>
              </div>
            </div>
          )}

          {/* Finalization Section */}
          {activeSection === 'finalize' && isPollEnded && poll.pollStatus !== 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Finalize Poll Results</h3>

              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Poll has ended. Results can now be finalized and anchored on-chain.</span>
              </div>

              <div className="stats shadow w-full">
                <div className="stat">
                  <div className="stat-title">Final Vote Count</div>
                  <div className="stat-value text-primary">{poll.votesCount}</div>
                  <div className="stat-desc">Total votes received</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Turnout Rate</div>
                  <div className="stat-value text-success">
                    {Math.round((poll.votesCount / poll.bindingsCount) * 100)}%
                  </div>
                  <div className="stat-desc">Of {poll.bindingsCount} eligible voters</div>
                </div>
              </div>

              {/* Steps to Finalization */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title">Finalization Steps</h4>
                  
                  <ul className="steps steps-vertical">
                    <li className="step step-primary">Generate Canonical votes.jsonl</li>
                    <li className="step step-primary">Create tally.json</li>
                    <li className="step step-primary">Compute Result Hash</li>
                    <li className="step">Pin files to IPFS</li>
                    <li className="step">Anchor to Blockchain</li>
                  </ul>

                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generate Results
                    </button>
                  </div>
                </div>
              </div>

              <div className="card bg-success text-success-content">
                <div className="card-body">
                  <h4 className="card-title">Anchor to Blockchain</h4>
                  <p className="text-sm">
                    After generating results, anchor the result hash to the blockchain for permanent verification.
                  </p>
                  <div className="card-actions justify-end mt-2">
                    <button className="btn btn-warning" disabled>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Anchor Result Hash
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results & Verification Section */}
          {activeSection === 'results' && poll.pollStatus === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Final Results & Verification</h3>

              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Results have been anchored on-chain and are permanently verifiable.</span>
              </div>

              {/* Final Results Chart */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title">Final Vote Distribution</h4>
                  <div className="space-y-4">
                    {poll.optionsJson.map((option, idx) => {
                      const mockVotes = [45, 28, 22][idx] || 0;
                      const percentage = (mockVotes / poll.votesCount) * 100;
                      return (
                        <div key={option.idx}>
                          <div className="flex justify-between mb-2">
                            <div>
                              <span className="font-bold text-lg">{option.label}</span>
                              {idx === 0 && <span className="badge badge-success ml-2">Winner</span>}
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{mockVotes} votes</div>
                              <div className="text-sm text-base-content/70">{percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                          <progress 
                            className={`progress progress-lg ${idx === 0 ? 'progress-success' : 'progress-base-300'}`}
                            value={percentage} 
                            max={100}
                          ></progress>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Blockchain Data */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="card-title">Blockchain Verification Data</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Result Hash (On-Chain)</span>
                      </label>
                      <div className="font-mono text-xs bg-base-300 p-3 rounded break-all">
                        0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Anchor Transaction</span>
                      </label>
                      <div className="font-mono text-xs bg-base-300 p-3 rounded break-all">
                        0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
                      </div>
                      <a href="#" className="link link-primary text-sm">View on Block Explorer</a>
                    </div>

                    <div className="divider">IPFS Files</div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="label">
                          <span className="label-text font-semibold text-xs">Proposal CID</span>
                        </label>
                        <div className="font-mono text-xs bg-base-300 p-2 rounded break-all">
                          bafy...bzdi
                        </div>
                        <a href="#" className="link link-primary text-xs">View</a>
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-semibold text-xs">Votes CID</span>
                        </label>
                        <div className="font-mono text-xs bg-base-300 p-2 rounded break-all">
                          bafy...xk3m
                        </div>
                        <a href="#" className="link link-primary text-xs">View</a>
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-semibold text-xs">Tally CID</span>
                        </label>
                        <div className="font-mono text-xs bg-base-300 p-2 rounded break-all">
                          bafy...n7pq
                        </div>
                        <a href="#" className="link link-primary text-xs">View</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Tools */}
              <div className="card bg-primary text-primary-content">
                <div className="card-body">
                  <h4 className="card-title">Independent Verification</h4>
                  <p className="text-sm">
                    Anyone can verify these results by downloading the IPFS files and comparing the computed hash with the on-chain result hash.
                  </p>
                  
                  <div className="mockup-code bg-primary-content/10 text-primary-content mt-3">
                    <pre><code className="text-xs">npx devote-verify \</code></pre>
                    <pre><code className="text-xs">  --poll {poll.id} \</code></pre>
                    <pre><code className="text-xs">  --proposal bafy...bzdi \</code></pre>
                    <pre><code className="text-xs">  --votes bafy...xk3m \</code></pre>
                    <pre><code className="text-xs">  --tally bafy...n7pq \</code></pre>
                    <pre><code className="text-xs">  --anchor 0x9876...dcba</code></pre>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-accent">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download All Files (ZIP)
                    </button>
                    <button className="btn btn-secondary">
                      Copy CLI Command
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-base-content/70">
                Results anchored on {new Date().toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-base-200 p-4 border-t border-base-300">
          <div className="flex justify-end">
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

