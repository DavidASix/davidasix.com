CREATE TABLE "youtube_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"video_id" varchar(11) NOT NULL UNIQUE,
	"title" varchar(255) NOT NULL,
	"author" varchar(64) NOT NULL,
	"url" varchar(255) NOT NULL,
	"thumbnail_url" varchar(255) NOT NULL,
	"transcript" text,
	"transcript_unavailable" boolean DEFAULT false NOT NULL,
	"thumbnail_analysis" text,
	"thumbnail_text" text,
	"short_summary" text,
	"analysis" text,
	"structure" text,
	"promise" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
