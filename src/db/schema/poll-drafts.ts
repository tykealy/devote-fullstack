import {
    pgTable, bigserial, bigint, text, smallint, timestamp, jsonb, index
  } from "drizzle-orm/pg-core";
  
  export const pollDraftsTable = pgTable("poll_drafts", {
    id: bigserial("id", { mode: "number" }).primaryKey(), // will become on-chain id
    title: text("title").notNull(),
    description: text("description"),
    optionsJson: jsonb("options_json").notNull(), // [{ idx, label, description?, mediaUri?, meta? }]
    startTs: bigint("start_ts", { mode: "number" }).notNull(),
    endTs: bigint("end_ts", { mode: "number" }).notNull(),
    status: smallint("status").notNull().default(0), // 0=Draft,1=Frozen,2=Published,3=Canceled
    createdBy: text("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    frozenAt: timestamp("frozen_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  }, t => [
    index("idx_drafts_status").on(t.status),
    index("idx_drafts_end_ts").on(t.endTs),
  ]);
