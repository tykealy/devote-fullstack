import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Decentralized Polling with On-Chain Verification
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-base-content/80">
              Vote privately off-chain, verify results on the blockchain
            </p>
            
            {/* Key Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">🔒</div>
                <h3 className="font-bold text-lg">Transparent</h3>
                <p className="text-sm text-base-content/70">
                  All votes auditable via cryptographic proofs
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">⚡</div>
                <h3 className="font-bold text-lg">Efficient</h3>
                <p className="text-sm text-base-content/70">
                  Low-cost anchoring (no on-chain voting gas fees)
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">✅</div>
                <h3 className="font-bold text-lg">Verifiable</h3>
                <p className="text-sm text-base-content/70">
                  Anyone can verify results independently via IPFS + blockchain
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                Browse Active Polls
              </Link>
              <a href="#how-it-works" className="btn btn-outline btn-lg">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <ul className="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact">
            {/* Step 1 */}
            <li>
              <div className="timeline-middle">
                <div className="badge badge-primary badge-lg">1</div>
              </div>
              <div className="timeline-end mb-10">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-2xl">Create & Invite</h3>
                    <p className="text-base-content/80">
                      Admin creates poll draft, uploads email allowlist, and issues magic link invites to eligible voters.
                    </p>
                  </div>
                </div>
              </div>
              <hr className="bg-primary" />
            </li>

            {/* Step 2 */}
            <li>
              <hr className="bg-primary" />
              <div className="timeline-middle">
                <div className="badge badge-primary badge-lg">2</div>
              </div>
              <div className="timeline-end mb-10">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-2xl">Register</h3>
                    <p className="text-base-content/80">
                      Users redeem invite, connect wallet, sign EIP-712 Register message. Email ↔ wallet binding stored securely.
                    </p>
                  </div>
                </div>
              </div>
              <hr className="bg-primary" />
            </li>

            {/* Step 3 */}
            <li>
              <hr className="bg-primary" />
              <div className="timeline-middle">
                <div className="badge badge-primary badge-lg">3</div>
              </div>
              <div className="timeline-end mb-10">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-2xl">Freeze Allowlist</h3>
                    <p className="text-base-content/80">
                      Build Merkle tree from bound wallets, pin proposal metadata to IPFS, call smart contract createPoll. Poll goes live.
                    </p>
                  </div>
                </div>
              </div>
              <hr className="bg-primary" />
            </li>

            {/* Step 4 */}
            <li>
              <hr className="bg-primary" />
              <div className="timeline-middle">
                <div className="badge badge-primary badge-lg">4</div>
              </div>
              <div className="timeline-end mb-10">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-2xl">Vote</h3>
                    <p className="text-base-content/80">
                      During voting window, users fetch Merkle proof, sign EIP-712 Vote message. Backend verifies signature + proof. Vote stored in DB + audit log.
                    </p>
                  </div>
                </div>
              </div>
              <hr className="bg-primary" />
            </li>

            {/* Step 5 */}
            <li>
              <hr className="bg-primary" />
              <div className="timeline-middle">
                <div className="badge badge-primary badge-lg">5</div>
              </div>
              <div className="timeline-end mb-10">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-2xl">Finalize & Anchor</h3>
                    <p className="text-base-content/80">
                      After voting closes, generate votes.jsonl + tally.json, compute resultHash = keccak256(votes || 0x1e || tally), pin to IPFS, and anchor on-chain.
                    </p>
                  </div>
                </div>
              </div>
              <hr className="bg-primary" />
            </li>

            {/* Step 6 */}
            <li>
              <hr className="bg-primary" />
              <div className="timeline-middle">
                <div className="badge badge-primary badge-lg">6</div>
              </div>
              <div className="timeline-end">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-2xl">Verify Results</h3>
                    <p className="text-base-content/80">
                      Users download IPFS files, recompute hash locally, and compare with on-chain resultHash for independent verification.
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-base-200">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title">EIP-712 Signed Votes</h3>
                  <div className="badge badge-primary">Security</div>
                </div>
                <p className="text-base-content/70">
                  Structured, typed signatures ensure vote integrity and non-repudiation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title">Merkle Proof Eligibility</h3>
                  <div className="badge badge-secondary">Privacy</div>
                </div>
                <p className="text-base-content/70">
                  Only allowlisted wallets can vote using cryptographic Merkle proofs.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title">Audit Log Chain</h3>
                  <div className="badge badge-accent">Transparency</div>
                </div>
                <p className="text-base-content/70">
                  Tamper-evident append-only log provides full vote history.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title">IPFS Storage</h3>
                  <div className="badge badge-info">Decentralized</div>
                </div>
                <p className="text-base-content/70">
                  Permanent, decentralized storage for poll metadata and results.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title">One Person, One Vote</h3>
                  <div className="badge badge-success">Fairness</div>
                </div>
                <p className="text-base-content/70">
                  First-vote-locks policy prevents double voting and manipulation.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title">Live Tallies</h3>
                  <div className="badge badge-warning">Real-time</div>
                </div>
                <p className="text-base-content/70">
                  Server-Sent Events (SSE) provide live vote count updates.
                </p>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title">Smart Contract Anchoring</h3>
                  <div className="badge badge-primary">Immutable</div>
                </div>
                <p className="text-base-content/70">
                  Final results permanently stored on-chain using Diamond pattern.
                </p>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title">CLI Verification</h3>
                  <div className="badge badge-secondary">Developer</div>
                </div>
                <p className="text-base-content/70">
                  Independent verification tools for complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Polls Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Active Polls</h2>
            <Link href="/dashboard" className="btn btn-outline">
              View All Polls
            </Link>
          </div>
          
          {/* Sample polls preview - in production this would fetch real data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Poll 1 */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="card-title text-lg">Community Governance Q1 2025</h3>
                  <div className="badge badge-success">Active</div>
                </div>
                <p className="text-sm text-base-content/70 mb-4">
                  Vote on key protocol improvements and budget allocation for the first quarter.
                </p>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <span className="font-mono">Ends in: 2d 14h 32m</span>
                </div>
                <div className="card-actions justify-end">
                  <Link href="/dashboard" className="btn btn-primary btn-sm">
                    Vote Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Sample Poll 2 */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="card-title text-lg">Feature Prioritization Survey</h3>
                  <div className="badge badge-success">Active</div>
                </div>
                <p className="text-sm text-base-content/70 mb-4">
                  Help us decide which features to build next for the platform roadmap.
                </p>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <span className="font-mono">Ends in: 5d 8h 15m</span>
                </div>
                <div className="card-actions justify-end">
                  <Link href="/dashboard" className="btn btn-primary btn-sm">
                    Vote Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Sample Poll 3 */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="card-title text-lg">Treasury Management Proposal</h3>
                  <div className="badge badge-warning">Closing Soon</div>
                </div>
                <p className="text-sm text-base-content/70 mb-4">
                  Decide on treasury diversification strategy and fund allocation.
                </p>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <span className="font-mono">Ends in: 6h 42m</span>
                </div>
                <div className="card-actions justify-end">
                  <Link href="/dashboard" className="btn btn-primary btn-sm">
                    Vote Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Badges */}
      <section className="py-12 px-4 bg-base-200">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center mb-8">Built With Industry-Leading Technology</h2>
          
          <div className="flex flex-wrap justify-center gap-3">
            <div className="badge badge-lg badge-primary">Ethereum/EVM</div>
            <div className="badge badge-lg badge-secondary">Next.js 14</div>
            <div className="badge badge-lg badge-accent">Drizzle ORM</div>
            <div className="badge badge-lg badge-info">Supabase</div>
            <div className="badge badge-lg badge-success">IPFS</div>
            <div className="badge badge-lg badge-warning">Wagmi</div>
            <div className="badge badge-lg badge-error">Viem</div>
            <div className="badge badge-lg">DaisyUI</div>
            <div className="badge badge-lg">Tailwind CSS</div>
            <div className="badge badge-lg badge-primary">TypeScript</div>
            <div className="badge badge-lg badge-secondary">EIP-712</div>
            <div className="badge badge-lg badge-accent">Diamond Pattern</div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="card bg-base-200 shadow-2xl">
            <div className="card-body text-center py-12">
              <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
                <div>
                  <h3 className="text-xl font-bold mb-2">For Voters</h3>
                  <p className="text-base-content/70">
                    Connect your wallet and participate in active polls with full transparency and verification.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">For Organizers</h3>
                  <p className="text-base-content/70">
                    Create your first poll and manage elections transparently with blockchain anchoring.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link href="/create-poll" className="btn btn-outline btn-lg">
                  Create a Poll
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center bg-base-300 text-base-content p-10">
        <div>
          <div className="text-2xl font-bold mb-2">DeVote</div>
          <p className="font-semibold">Decentralized Polling with On-Chain Verification</p>
          <p className="text-sm text-base-content/70">
            Transparent, efficient, and verifiable polling for the decentralized web
          </p>
        </div>
        
        <nav className="grid grid-flow-col gap-4">
          <Link href="/dashboard" className="link link-hover">Dashboard</Link>
          <Link href="/create-poll" className="link link-hover">Create Poll</Link>
          <a href="#" className="link link-hover">Documentation</a>
          <a href="#" className="link link-hover">GitHub</a>
        </nav>
        
        <nav className="grid grid-flow-col gap-4">
          <a href="#" className="link link-hover text-sm">Privacy Policy</a>
          <a href="#" className="link link-hover text-sm">Terms of Service</a>
        </nav>
        
        <aside>
          <p className="text-sm text-base-content/60">
            © {new Date().getFullYear()} DeVote. Built with ❤️ for transparent governance.
          </p>
        </aside>
      </footer>
    </main>
  );
}
