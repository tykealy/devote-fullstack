
Here’s the **full summary** of everything we’ve designed so far — from the smart contract through backend/frontend and database flow. I’ve written it so another AI (or dev) can ingest it and have enough context to continue work without missing pieces.

---

# Project: Decentralized Polling Platform (Anchor-Only, 1p1v)

## 1. Smart Contract (Diamond pattern)

* **Library (`LibDeVote`)**

  * `createPoll(id, eligibleRoot, start, end, metaURI)` → creates poll, sets status=Active.
  * `anchorResult(id, resultHash)` → finalize poll, only owner, requires after `end`, sets status=Anchored.
  * `closePoll(id)` → invalidates a poll, sets status=Closed.
  * `getPoll(id)` → returns `Poll` struct.

* **Struct `Poll`**

  * `bytes32 eligibleRoot`
  * `uint64 start`, `uint64 end`
  * `string metaURI` (IPFS CID)
  * `bytes32 resultHash`
  * `Status status` (Active, Closed, Anchored)
  * `address creator`

* **Facet (`DeVoteFacet`)**

  * Wraps library functions in external methods.
  * `status(id)` helper for frontend.
  * Events: `PollCreated`, `PollAnchored`, `PollClosed`.

* **Access Control**

  * Mutating ops restricted to **contract owner** (platform model).
  * Optional: allow `creator` or hybrid policy.

---

## 2. Database (Supabase Postgres, Drizzle ORM)

### Core tables

* **polls**

  * Poll config, on-chain mirror (root, status, resultHash, CIDs).
* **bindings**

  * Email_hash ↔ wallet binding (Register).
* **votes**

  * One vote per `(poll_id, wallet)`; signature, proof, nonce, deadline.
  * Policy: **first-vote-locks** or **latest-wins**.
* **anchors**

  * Anchoring record: resultHash, IPFS CIDs, tx hash.
* **audit_log**

  * Append-only hash chain of accepted votes for tamper-evidence.

### Optional tables

* **invites** — magic links issued/redeemed.
* **allowlist_items** — cache of leaves/proofs for fast retrieval.

### Indexes

* `polls`: status, end_ts, eligible_root
* `votes`: poll_id, wallet
* `audit_log`: (poll_id, seq), (poll_id, tip_hash)

---

## 3. Process Flow

1. **Create poll draft (off-chain)**

   * Admin sets title, options, start/end.
   * Upload email list → `invites`.

2. **Register / Bind**

   * User redeems invite → signs Register (EIP-712).
   * API verifies → insert `bindings (email_hash, wallet, sig, nonce, deadline)`.

3. **Freeze allowlist**

   * Collect final bound wallets.
   * Build Merkle tree → compute `eligibleRoot`.
   * Pin `proposal.json` → `metaURI`.
   * Call contract `createPoll` with `(id, eligibleRoot, start, end, metaURI)`.
   * Insert into `polls`.

4. **Voting window**

   * Client fetches proof from `/api/proof`.
   * Signs Vote (EIP-712) → `POST /api/vote`.
   * API verifies signature + proof + policy.
   * Insert into `votes`, append `audit_log`.
   * SSE/WebSocket pushes live tally.

5. **Close intake (after `end_ts`)**

   * Reject late votes.

6. **Finalize**

   * Build canonical `votes.jsonl` + `tally.json`.
   * Compute `resultHash = keccak256(votes.jsonl || 0x1e || tally.json)`.
   * Pin to IPFS.
   * Insert into `anchors`.
   * Call contract `anchorResult(id, resultHash)`.
   * Update `polls.status=Anchored`.

7. **Results**

   * API serves `{proposalCid, votesCid, tallyCid, resultHash, anchorTx}`.
   * Users can verify via CLI/browser by recomputing `resultHash` and comparing with on-chain.

---

## 4. Backend (Next.js API routes)

* API routes (`app/api/.../route.ts`):

  * `POST /api/register`
  * `GET /api/proof`
  * `POST /api/vote`
  * `GET /api/polls/:id`
  * `GET /api/polls/:id/stream` (SSE live tally)
  * `POST /api/admin/freeze`
  * `POST /api/admin/finalize`

* **Jobs**

  * MerkleBuilder (freeze allowlist).
  * IpfsPublisher (proposal, votes, tally).
  * AnchorJob (call contract, update DB).
  * AuditSnapshot (publish tip of audit log).

* **Security**

  * Supabase RLS: `bindings`/`invites` private; `polls`/`votes`/`anchors` public read, writes via service role.
  * EIP-712 strict verification.
  * Nonce/deadline enforcement.

---

## 5. Frontend (Next.js App Router + Daisy)

* **Client (wagmi + viem)**

  * Connect wallet, sign Register, sign Vote.
  * Pages:

    * `/poll/[id]` — poll detail + live tally
    * `/poll/[id]/register` — magic link landing
    * `/poll/[id]/vote` — cast vote
    * `/poll/[id]/results` — final anchored results

* **UI components (Daisy + Tailwind)**

  * WalletConnectButton
  * RegisterCard
  * VoteCard
  * ResultsChart
  * StatusBadge

* **Data fetching**

  * API routes (`/api/...`)
  * SSE for live tallies
  * Display anchorTx + IPFS CIDs on results page.

---

## 6. File hashing & verification

* **proposal.json** — poll metadata (title, options, start, end, eligibleRoot, rules).
* **votes.jsonl** — canonical vote rows (sorted, deduped).
* **tally.json** — reduced counts.
* **resultHash** = `keccak256(votes.jsonl || 0x1e || tally.json)`.
* Anchored on-chain in `Poll.resultHash`.

CLI verifier (Node script):

```bash
npx devote-verify --poll 123 \
  --proposal bafy... \
  --votes bafy... \
  --tally bafy... \
  --anchor 0xHashFromChain
```

---

# TL;DR for AI

This project is a **polling platform using smart contracts + off-chain vote storage**.

* **Smart contract** stores only poll metadata, eligible root, and final result hash (anchored).
* **Off-chain (Supabase Postgres)** stores bindings, votes, audit log.
* **Backend (Next.js API routes)** handles registration, proof, voting, tallying, finalization.
* **Frontend (Next.js + Daisy)** lets users register via wallet, vote, and see results.
* **Verification**: final results are pinned to IPFS, hashed deterministically, and anchored on-chain.

This ensures:

* Transparent vote intake and tallying.
* Minimal on-chain cost (anchor-only).
* Deterministic, reproducible results anyone can verify independently.

---

👉 Do you want me to now create a **sequence diagram** (from invite → bind → vote → finalize → anchor) to visualize this whole process?
