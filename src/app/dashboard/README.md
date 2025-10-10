# Admin Dashboard

## Overview
The Admin Dashboard is the control center for poll organizers to manage the complete poll lifecycle on the DeVote platform - from draft creation through blockchain anchoring.

## File Structure

```
dashboard/
├── page.tsx                        # Main dashboard page (Server Component)
├── components/
│   ├── AdminNavbar.tsx            # Top navigation with wallet connection
│   ├── StatsPanel.tsx             # Dashboard statistics overview
│   ├── PollsTable.tsx             # Interactive polls table with filtering
│   └── PollManagementModal.tsx    # Comprehensive poll lifecycle management
└── README.md                       # This file
```

## Components

### 1. AdminNavbar
**Type:** Client Component

**Features:**
- Logo and branding
- Navigation menu (Dashboard, Create Poll, Documentation)
- Wallet connection status
- User dropdown menu
- Mobile responsive with hamburger menu

**Future Integration:**
- Replace mock wallet state with wagmi `useAccount()` and `useConnect()` hooks
- Add real wallet connection logic

### 2. StatsPanel
**Type:** Client Component

**Features:**
- Total Polls Created
- Active Polls (currently accepting votes)
- Total Votes Cast (across all polls)
- Pending Invites (awaiting redemption)

**Props:**
```typescript
interface StatsPanelProps {
  stats: {
    totalPolls: number;
    activePolls: number;
    totalVotes: number;
    pendingInvites: number;
  };
}
```

**Future Integration:**
- Replace with real-time data from database queries
- Add SSE or polling for live updates

### 3. PollsTable
**Type:** Client Component

**Features:**
- Tab-based filtering (All, Drafts, Frozen, Published, Canceled)
- Desktop: Full table view with all columns
- Mobile: Card-based responsive layout
- Status badges with color coding
- Progress indicators for invites/participation
- Quick actions per poll
- Empty state with CTA

**Status Color Scheme:**
- Draft: `badge-ghost` (neutral)
- Frozen: `badge-info` (blue)
- Published: `badge-success` (green)
- Closed: `badge-warning` (yellow)
- Anchored: `badge-primary` (purple)
- Canceled: `badge-error` (red)

**Props:**
```typescript
interface PollsTableProps {
  initialPolls: Poll[];
}
```

**Future Integration:**
- Add sorting functionality
- Add search/filter by title
- Add pagination for large datasets
- Connect to real database via API routes or Server Actions

### 4. PollManagementModal
**Type:** Client Component

**Features:**
The most comprehensive component, handling the entire poll lifecycle with multiple sections:

#### A. Poll Details Section
- View/edit poll information (title, description, options)
- Display timeline (start/end dates)
- Show creator and metadata
- Actions: Save, Cancel Poll, Delete Draft
- **Editable only in Draft status**

#### B. Invites & Allowlist Section
Sub-sections:
- **Upload Emails**: CSV/TXT file upload or manual paste
- **Issued Invites**: Table showing all generated invites with status
- **Registered Users**: List of wallets that completed registration
- **Registration Progress**: Stats showing invite redemption and wallet binding
- **Freeze Allowlist Button**: Triggers Merkle tree generation (only in Draft with registrations)

#### C. Publish to Blockchain Section
**Visible only if status = Frozen**

Features:
- Display computed Merkle root (eligibleRoot)
- Show IPFS CID for proposal.json
- Review blockchain parameters
- **Publish Poll** button → calls smart contract `createPoll()`

**Future Integration:**
- Connect to wagmi for contract interaction
- Add transaction status tracking
- Display gas estimates

#### D. Live Monitoring Section
**Visible only if poll is Active**

Features:
- Real-time vote count and participation rate
- Countdown timer to poll end
- Live tally chart showing vote distribution per option
- Recent votes stream (last 10-20 votes)
- Audit chain status (current tip hash, sequence count)

**Future Integration:**
- Connect to SSE endpoint (`GET /api/polls/:id/stream`)
- Add WebSocket for real-time updates
- Add refresh button for manual updates

#### E. Finalization Section
**Visible only if poll ended and not yet anchored**

Features:
- Final vote count and turnout statistics
- Step-by-step finalization progress
- **Generate Results** button:
  - Creates `votes.jsonl` (canonical, sorted)
  - Creates `tally.json` with vote counts
  - Computes `resultHash = keccak256(votes || 0x1e || tally)`
  - Pins all files to IPFS
- **Anchor Result Hash** button → calls `anchorResult(pollId, resultHash)`

**Future Integration:**
- Connect to backend API for result generation
- Add IPFS pinning service integration
- Add transaction tracking for anchoring

#### F. Results & Verification Section
**Visible only if poll is Anchored**

Features:
- Final vote distribution chart with winner badge
- Display on-chain result hash
- Show anchor transaction hash with block explorer link
- Display all IPFS CIDs (proposal, votes, tally)
- Independent verification instructions
- CLI command generator
- **Download All Files** button (ZIP)

**Future Integration:**
- Add real IPFS gateway links
- Generate actual CLI verification command
- Implement file download/ZIP creation

## Poll Status Flow

```
Draft (0)
  ↓ [User uploads emails, generates invites]
  ↓ [Users register wallets]
  ↓ [Admin freezes allowlist → builds Merkle tree, pins to IPFS]
  ↓
Frozen (1)
  ↓ [Admin publishes to blockchain]
  ↓
Published (2)
  ├─→ Poll Status: Active (0) [during voting window]
  ├─→ Poll Status: Closed (1) [after endTs]
  └─→ Poll Status: Anchored (2) [after anchoring results]
  
Canceled (3) [at any time before publishing]
```

## Database Schema Integration

The dashboard uses the following tables:

### poll_drafts
- Primary source of poll data
- Contains title, description, options, timeline, status
- Links to invites and bindings

### invites
- Email hash → token hash mapping
- Tracks invite issuance and redemption
- FK to poll_drafts

### bindings
- Email hash → wallet binding
- Stores EIP-712 Register signatures
- Used to build Merkle tree

### polls
- Mirror of on-chain poll state
- Contains eligibleRoot, metaUri, status
- Links to votes

### votes
- Individual vote records
- Enforces 1p1v via primary key (pollId, wallet)
- Contains Merkle proof and EIP-712 signature

### anchors
- Final results and IPFS CIDs
- Links proposal/votes/tally CIDs
- Stores blockchain transaction hash

## Mock Data vs Production

Currently, the dashboard uses mock data in `page.tsx`. To integrate with production:

### 1. Replace Mock Data Fetching
```typescript
// Current (mock):
const { stats, polls } = await getMockDashboardData();

// Production:
import { db } from '@/db';
import { pollDraftsTable, votesTable, invitesTable } from '@/db/schema';
import { count, eq, isNull } from 'drizzle-orm';

const polls = await db.select().from(pollDraftsTable);
const totalVotes = await db.select({ count: count() }).from(votesTable);
const pendingInvites = await db
  .select({ count: count() })
  .from(invitesTable)
  .where(isNull(invitesTable.redeemedAt));
```

### 2. Add API Routes
Create the following endpoints:

- `POST /api/admin/polls` - Create poll draft
- `PATCH /api/admin/polls/:id` - Update poll
- `POST /api/admin/polls/:id/invites` - Generate invites
- `POST /api/admin/polls/:id/freeze` - Freeze allowlist
- `POST /api/admin/polls/:id/publish` - Publish to blockchain
- `GET /api/admin/polls/:id/stats` - Real-time stats
- `GET /api/admin/polls/:id/stream` - SSE for live updates
- `POST /api/admin/polls/:id/finalize` - Generate results
- `POST /api/admin/polls/:id/anchor` - Anchor to blockchain

### 3. Add Blockchain Integration
```typescript
// Use wagmi hooks in components:
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

// Example for publishing:
const { config } = usePrepareContractWrite({
  address: DEVOTE_CONTRACT_ADDRESS,
  abi: DEVOTE_ABI,
  functionName: 'createPoll',
  args: [pollId, eligibleRoot, startTs, endTs, metaUri],
});

const { write } = useContractWrite(config);
```

### 4. Add IPFS Integration
```typescript
// Use Pinata, Web3.Storage, or similar:
import { pinJSONToIPFS, pinFileToIPFS } from '@/lib/ipfs';

const cid = await pinJSONToIPFS({
  poll,
  options: poll.optionsJson,
  eligibleRoot,
  // ... proposal metadata
});
```

## Styling & Theme

- **Theme**: DaisyUI `lofi` (set in root layout.tsx)
- **Fonts**: 
  - Geist Sans (main UI)
  - Geist Mono (addresses, hashes, code)
- **Responsive Breakpoints**:
  - Mobile: < 1024px (card layout)
  - Desktop: ≥ 1024px (table layout)

## Accessibility

- All interactive elements have proper labels
- Keyboard navigation supported
- Loading states for async operations
- Error messages prominently displayed
- Confirmation modals for destructive actions

## Next Steps

1. **Database Integration**
   - Replace mock data with Drizzle ORM queries
   - Add Server Actions for mutations
   
2. **Blockchain Integration**
   - Add wagmi provider to layout
   - Implement contract write functions
   - Add transaction status tracking

3. **IPFS Integration**
   - Set up IPFS pinning service
   - Implement file upload/download
   - Add gateway links

4. **Real-time Features**
   - Implement SSE endpoint for live tally
   - Add WebSocket support
   - Add optimistic UI updates

5. **Authentication & Authorization**
   - Verify admin wallet ownership
   - Check poll.createdBy matches connected wallet
   - Add platform owner override

6. **Testing**
   - Unit tests for components
   - Integration tests for API routes
   - E2E tests for critical flows

## License

Part of the DeVote project.

