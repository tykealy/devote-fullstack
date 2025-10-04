import { bigint, timestamp, pgTable, foreignKey, unique, primaryKey } from "drizzle-orm/pg-core";
import { bytea } from "./types";
import { pollDraftsTable } from "./poll-drafts";

export const invitesTable = pgTable("invites", {
    emailHash: bytea("email_hash").notNull(),
    draftId: bigint("draft_id", { mode: "bigint" }).notNull(),
    tokenHash: bytea("token_hash").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true }).notNull(),
    redeemedAt: timestamp("redeemed_at", { withTimezone: true }),
}, (table) => [
    foreignKey({
        columns: [table.draftId],
        foreignColumns: [pollDraftsTable.id],
        name: "invites_draft_id_fk"
    }).onDelete("cascade"),
    primaryKey({ columns: [table.draftId, table.emailHash] }),
    unique("uq_invites_token").on(table.draftId, table.tokenHash),    
]);
