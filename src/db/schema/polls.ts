import { bigint, smallint, text, timestamp, pgTable, index } from "drizzle-orm/pg-core";
import { bytea } from "./types";

export const pollsTable = pgTable("polls", {
    id: bigint("id", { mode: "number" }).primaryKey(), 
    title: text(), // optional convenience for UI
    metaUri: text("meta_uri").notNull(), // IPFS CID for proposal.json
    startTs: bigint("start_ts", { mode: "bigint" }).notNull(), // unix seconds
    endTs: bigint("end_ts", { mode: "bigint" }).notNull(),
    eligibleRoot: bytea("eligible_root").notNull(), // 32 bytes
    status: smallint().notNull().default(0), // 0=Active, 1=Closed, 2=Anchored
    resultHash: bytea("result_hash"), // 32 bytes, set when Anchored
    createdBy: text("created_by").notNull(), // creator address (lowercased)
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index("idx_polls_status").on(table.status),
    index("idx_polls_end_ts").on(table.endTs),
    index("idx_polls_eligible_root").on(table.eligibleRoot)
]);