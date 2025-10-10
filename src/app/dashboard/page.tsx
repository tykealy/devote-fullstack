import Link from 'next/link';
import { StatsPanel } from './components/StatsPanel';
import { PollsTable } from './components/PollsTable';
import { AdminNavbar } from './components/AdminNavbar';

// Mock data for initial implementation - will be replaced with real DB queries
const getMockDashboardData = async () => {
  // In production, these would be actual database queries:
  // const polls = await db.select().from(pollDraftsTable).orderBy(desc(pollDraftsTable.createdAt));
  // const activePolls = await db.select().from(pollsTable).where(eq(pollsTable.status, 0));
  // const totalVotes = await db.select({ count: count() }).from(votesTable);
  // const pendingInvites = await db.select({ count: count() }).from(invitesTable).where(isNull(invitesTable.redeemedAt));
  
  return {
    stats: {
      totalPolls: 12,
      activePolls: 3,
      totalVotes: 1247,
      pendingInvites: 42,
    },
    polls: [
      {
        id: 1,
        title: 'Community Governance Q1 2025',
        description: 'Vote on key protocol improvements and budget allocation',
        status: 2, // Published
        pollStatus: 0, // Active
        startTs: Math.floor(Date.now() / 1000) - 86400,
        endTs: Math.floor(Date.now() / 1000) + 172800,
        invitesTotal: 150,
        invitesRedeemed: 128,
        bindingsCount: 128,
        votesCount: 95,
        createdBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        optionsJson: [
          { idx: 0, label: 'Approve Budget', description: 'Approve the Q1 budget as proposed' },
          { idx: 1, label: 'Request Revision', description: 'Request modifications to the budget' },
          { idx: 2, label: 'Reject', description: 'Reject the proposal entirely' },
        ],
      },
      {
        id: 2,
        title: 'Feature Prioritization Survey',
        description: 'Help us decide which features to build next',
        status: 2, // Published
        pollStatus: 0, // Active
        startTs: Math.floor(Date.now() / 1000) - 43200,
        endTs: Math.floor(Date.now() / 1000) + 432000,
        invitesTotal: 200,
        invitesRedeemed: 185,
        bindingsCount: 185,
        votesCount: 142,
        createdBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        optionsJson: [
          { idx: 0, label: 'Mobile App', description: 'Native mobile application' },
          { idx: 1, label: 'Advanced Analytics', description: 'Real-time voting analytics' },
          { idx: 2, label: 'Multi-chain Support', description: 'Deploy to multiple chains' },
          { idx: 3, label: 'Delegation System', description: 'Vote delegation features' },
        ],
      },
      {
        id: 3,
        title: 'Treasury Management Proposal',
        description: 'Decide on treasury diversification strategy',
        status: 2, // Published
        pollStatus: 1, // Closed
        startTs: Math.floor(Date.now() / 1000) - 604800,
        endTs: Math.floor(Date.now() / 1000) - 3600,
        invitesTotal: 100,
        invitesRedeemed: 98,
        bindingsCount: 98,
        votesCount: 87,
        createdBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        optionsJson: [
          { idx: 0, label: 'Option A', description: '60% Stablecoins, 40% ETH' },
          { idx: 1, label: 'Option B', description: '80% Stablecoins, 20% ETH' },
        ],
      },
      {
        id: 4,
        title: 'Marketing Campaign Direction',
        description: 'Choose the primary marketing focus for next quarter',
        status: 1, // Frozen
        startTs: Math.floor(Date.now() / 1000) + 86400,
        endTs: Math.floor(Date.now() / 1000) + 604800,
        invitesTotal: 75,
        invitesRedeemed: 68,
        bindingsCount: 68,
        votesCount: 0,
        createdBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        optionsJson: [
          { idx: 0, label: 'Social Media', description: 'Focus on Twitter/Discord growth' },
          { idx: 1, label: 'Partnerships', description: 'Strategic partnerships and integrations' },
          { idx: 2, label: 'Content Marketing', description: 'Blog posts and educational content' },
        ],
      },
      {
        id: 5,
        title: 'Protocol Security Audit Vendor Selection',
        description: 'Vote on which security firm should audit our smart contracts',
        status: 0, // Draft
        startTs: Math.floor(Date.now() / 1000) + 172800,
        endTs: Math.floor(Date.now() / 1000) + 604800,
        invitesTotal: 50,
        invitesRedeemed: 12,
        bindingsCount: 12,
        votesCount: 0,
        createdBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        optionsJson: [
          { idx: 0, label: 'Trail of Bits', description: 'Industry leader in smart contract audits' },
          { idx: 1, label: 'OpenZeppelin', description: 'Trusted security auditor' },
          { idx: 2, label: 'Consensys Diligence', description: 'Ethereum ecosystem expert' },
        ],
      },
    ],
  };
};

export default async function AdminDashboard() {
  // Fetch initial data - Server Component
  const { stats, polls } = await getMockDashboardData();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Admin Navbar */}
      <AdminNavbar />
      
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-base-content/70">
            Manage polls, monitor voting activity, and anchor results to the blockchain
          </p>
        </div>

        {/* Stats Overview */}
        <StatsPanel stats={stats} />
        
        {/* Create Poll CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-8">
          <div>
            <h2 className="text-3xl font-bold">Polls Management</h2>
            <p className="text-base-content/70 mt-1">
              Create, edit, and manage the complete poll lifecycle
            </p>
          </div>
          <Link 
            href="/create-poll" 
            className="btn btn-primary btn-lg gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Poll
          </Link>
        </div>
        
        {/* Polls Table with Filters */}
        <PollsTable initialPolls={polls} />

        {/* Quick Actions Sidebar - Desktop Only */}
        <div className="hidden xl:block fixed right-8 top-24 w-64">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg mb-2">Quick Actions</h3>
              <ul className="menu menu-compact p-0">
                <li>
                  <Link href="/create-poll" className="gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Poll
                  </Link>
                </li>
                <li>
                  <a className="gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Active Polls
                    <span className="badge badge-primary badge-sm">{stats.activePolls}</span>
                  </a>
                </li>
                <li>
                  <a className="gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Pending Invites
                    <span className="badge badge-warning badge-sm">{stats.pendingInvites}</span>
                  </a>
                </li>
                <li>
                  <a className="gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Needs Finalization
                    <span className="badge badge-info badge-sm">1</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

