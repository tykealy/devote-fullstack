import { bigint, text, timestamp, pgTable, foreignKey } from "drizzle-orm/pg-core";
import { bytea } from "./types";
import { pollsTable } from "./polls";

export const anchorsTable = pgTable("anchors", {
    pollId: bigint("poll_id", { mode: "bigint" }).primaryKey(), // FK polls(id)
    resultHash: bytea("result_hash").notNull(), // 32 bytes
    proposalCid: text("proposal_cid").notNull(),
    votesCid: text("votes_cid").notNull(),
    tallyCid: text("tally_cid").notNull(),
    txHash: text("tx_hash").notNull(),
    anchoredAt: timestamp("anchored_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    pollIdFk: foreignKey({
        columns: [table.pollId],
        foreignColumns: [pollsTable.id],
        name: "anchors_poll_id_fk"
    }).onDelete("cascade"),
}));
