CREATE TABLE "allowlist_items" (
	"poll_id" bigint NOT NULL,
	"wallet" text NOT NULL,
	"index" bigint NOT NULL,
	"leaf" "bytea" NOT NULL,
	"proof_json" jsonb NOT NULL,
	CONSTRAINT "allowlist_items_poll_id_wallet_pk" PRIMARY KEY("poll_id","wallet"),
	CONSTRAINT "allowlist_poll_index_unique" UNIQUE("poll_id","index")
);
--> statement-breakpoint
CREATE TABLE "anchors" (
	"poll_id" bigint PRIMARY KEY NOT NULL,
	"result_hash" "bytea" NOT NULL,
	"proposal_cid" text NOT NULL,
	"votes_cid" text NOT NULL,
	"tally_cid" text NOT NULL,
	"tx_hash" text NOT NULL,
	"anchored_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"seq" bigserial PRIMARY KEY NOT NULL,
	"poll_id" bigint NOT NULL,
	"row_hash" "bytea" NOT NULL,
	"prev_hash" "bytea" NOT NULL,
	"tip_hash" "bytea" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "idx_audit_poll_tip" UNIQUE("poll_id","tip_hash")
);
--> statement-breakpoint
CREATE TABLE "bindings" (
	"email_hash" "bytea",
	"draft_id" bigint NOT NULL,
	"wallet" text NOT NULL,
	"sig" "bytea" NOT NULL,
	"nonce" bigint NOT NULL,
	"deadline" bigint NOT NULL,
	"bound_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "bindings_draft_id_email_hash_pk" PRIMARY KEY("draft_id","email_hash"),
	CONSTRAINT "bindings_draft_email_unique" UNIQUE("draft_id","email_hash")
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"email_hash" "bytea" NOT NULL,
	"draft_id" bigint NOT NULL,
	"token_hash" "bytea" NOT NULL,
	"issued_at" timestamp with time zone NOT NULL,
	"redeemed_at" timestamp with time zone,
	CONSTRAINT "invites_draft_id_email_hash_pk" PRIMARY KEY("draft_id","email_hash"),
	CONSTRAINT "uq_invites_token" UNIQUE("draft_id","token_hash")
);
--> statement-breakpoint
CREATE TABLE "poll_drafts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"options_json" jsonb NOT NULL,
	"start_ts" bigint NOT NULL,
	"end_ts" bigint NOT NULL,
	"status" smallint DEFAULT 0 NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"frozen_at" timestamp with time zone,
	"published_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "poll_options" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"poll_id" bigint NOT NULL,
	"idx" smallint NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"media_uri" text,
	"meta_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_poll_idx" UNIQUE("poll_id","idx")
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" bigint PRIMARY KEY NOT NULL,
	"title" text,
	"meta_uri" text NOT NULL,
	"start_ts" bigint NOT NULL,
	"end_ts" bigint NOT NULL,
	"eligible_root" "bytea" NOT NULL,
	"status" smallint DEFAULT 0 NOT NULL,
	"result_hash" "bytea",
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"poll_id" bigint NOT NULL,
	"wallet" text NOT NULL,
	"option" smallint NOT NULL,
	"sig" "bytea" NOT NULL,
	"nonce" bigint NOT NULL,
	"deadline" bigint NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"leaf" "bytea" NOT NULL,
	"proof_json" jsonb NOT NULL,
	CONSTRAINT "votes_poll_id_wallet_pk" PRIMARY KEY("poll_id","wallet")
);
--> statement-breakpoint
ALTER TABLE "allowlist_items" ADD CONSTRAINT "allowlist_items_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anchors" ADD CONSTRAINT "anchors_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bindings" ADD CONSTRAINT "bindings_draft_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."poll_drafts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_draft_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."poll_drafts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_allowlist_items_wallet" ON "allowlist_items" USING btree ("wallet");--> statement-breakpoint
CREATE INDEX "idx_audit_poll_seq" ON "audit_log" USING btree ("poll_id","seq");--> statement-breakpoint
CREATE INDEX "idx_bindings_wallet" ON "bindings" USING btree ("wallet");--> statement-breakpoint
CREATE INDEX "idx_drafts_status" ON "poll_drafts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_drafts_end_ts" ON "poll_drafts" USING btree ("end_ts");--> statement-breakpoint
CREATE INDEX "idx_polls_status" ON "polls" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_polls_end_ts" ON "polls" USING btree ("end_ts");--> statement-breakpoint
CREATE INDEX "idx_polls_eligible_root" ON "polls" USING btree ("eligible_root");--> statement-breakpoint
CREATE INDEX "idx_votes_poll" ON "votes" USING btree ("poll_id");--> statement-breakpoint
CREATE INDEX "idx_votes_wallet" ON "votes" USING btree ("wallet");