import { bigint, text, timestamp, pgTable, foreignKey, unique, primaryKey, index } from "drizzle-orm/pg-core";
import { bytea } from "./types";
import { pollDraftsTable } from "./poll-drafts";

export const bindingsTable = pgTable("bindings", {
    emailHash: bytea("email_hash"), // 32 bytes (keccak(lower(email)||salt))
    draftId: bigint("draft_id", { mode: "bigint" }).notNull(), // FK poll_drafts(id)
    wallet: text().notNull(), // 0x… lowercased
    sig: bytea().notNull(), // Register signature
    nonce: bigint({ mode: "bigint" }).notNull(),
    deadline: bigint({ mode: "bigint" }).notNull(),
    boundAt: timestamp("bound_at", { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
}, (table) => [
    // Constraints
    unique("bindings_draft_email_unique").on(table.draftId, table.emailHash),
    foreignKey({
        columns: [table.draftId],
        foreignColumns: [pollDraftsTable.id],
        name: "bindings_draft_id_fk"
    }).onDelete("cascade"),
    primaryKey({ columns: [table.draftId, table.emailHash] }),
    index("idx_bindings_wallet").on(table.wallet),
]);
