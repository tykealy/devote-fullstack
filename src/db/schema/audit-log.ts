import { bigserial, bigint, timestamp, pgTable, index, unique } from "drizzle-orm/pg-core";
import { bytea } from "./types";
import { pollsTable } from "./polls";

export const auditLogTable = pgTable("audit_log", {
    seq: bigserial({ mode: "number" }).primaryKey(), // monotonic sequence
    pollId: bigint("poll_id", { mode: "bigint" }).notNull().references(() => pollsTable.id, { onDelete: "cascade" }),  
    rowHash: bytea("row_hash").notNull(), // hash(vote_row_canonical)
    prevHash: bytea("prev_hash").notNull(), // last tip (for the poll)
    tipHash: bytea("tip_hash").notNull(), // keccak(prev_hash || row_hash)
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    // Indexes
    index("idx_audit_poll_seq").on(table.pollId, table.seq),
    unique("idx_audit_poll_tip").on(table.pollId, table.tipHash),
]);
