import {
  pgTable, bigserial, bigint, smallint, text, jsonb, timestamp, unique
} from "drizzle-orm/pg-core";
import { pollsTable } from "./polls";

export const pollOptionsTable = pgTable("poll_options", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  pollId: bigint("poll_id", { mode: "number" }).notNull()
    .references(() => pollsTable.id, { onDelete: "cascade" }),
  idx: smallint("idx").notNull(),  // 0..N-1 matches signed option index
  label: text("label").notNull(),
  description: text("description"),
  mediaUri: text("media_uri"),
  metaJson: jsonb("meta_json"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, t => [
  unique("uq_poll_idx").on(t.pollId, t.idx),
]);