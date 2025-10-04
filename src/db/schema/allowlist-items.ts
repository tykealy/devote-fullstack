import { bigint, text, jsonb, pgTable, foreignKey, unique, primaryKey, index } from "drizzle-orm/pg-core";
import { bytea } from "./types";
import { pollsTable } from "./polls";

export const allowlistItemsTable = pgTable("allowlist_items", {
    pollId: bigint("poll_id", { mode: "bigint" }).notNull(),
    wallet: text().notNull(),
    index: bigint({ mode: "bigint" }).notNull(),
    leaf: bytea().notNull(), // 32 bytes
    proofJson: jsonb("proof_json").notNull(),
}, (table) => [
    // Primary key
    primaryKey({ columns: [table.pollId, table.wallet] }),
    // Constraints
    unique("allowlist_poll_index_unique").on(table.pollId, table.index),
    foreignKey({
        columns: [table.pollId],
        foreignColumns: [pollsTable.id],
        name: "allowlist_items_poll_id_fk"
    }).onDelete("cascade"),
    index("idx_allowlist_items_wallet").on(table.wallet),
]);
