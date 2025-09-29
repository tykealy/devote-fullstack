import { bigint, smallint, text, timestamp, jsonb, pgTable, foreignKey, index, primaryKey } from "drizzle-orm/pg-core";
import { bytea } from "./types";
import { pollsTable } from "./polls";

export const votesTable = pgTable("votes", {
    pollId: bigint("poll_id", { mode: "bigint" }).notNull().references(() => pollsTable.id, { onDelete: "cascade" }),     
    wallet: text().notNull(), // 0x… lower
    option: smallint().notNull(),
    sig: bytea().notNull(), // Vote signature
    nonce: bigint({ mode: "bigint" }).notNull(),
    deadline: bigint({ mode: "bigint" }).notNull(),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    leaf: bytea().notNull(), // 32 bytes (keccakPacked(wallet,pollId))
    proofJson: jsonb("proof_json").notNull(), // array of hex nodes
}, (table) => [
    // Primary key (Option A: first-vote-locks, simpler)
    primaryKey({ columns: [table.pollId, table.wallet] }),
    // Indexes
    index("idx_votes_poll").on(table.pollId),
    index("idx_votes_wallet").on(table.wallet),
    // Foreign key
    foreignKey({
        columns: [table.pollId],
        foreignColumns: [pollsTable.id],
        name: "votes_poll_id_fk"
    }).onDelete("cascade"),
]);
