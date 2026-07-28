import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const youtubeVideos = pgTable("youtube_videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: varchar("video_id", { length: 11 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 64 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 255 }).notNull(),
  transcript: text("transcript"),
  transcriptUnavailable: boolean("transcript_unavailable")
    .default(false)
    .notNull(),
  thumbnailAnalysis: text("thumbnail_analysis"),
  /**
   * The text found in the thumbnail
   */
  thumbnailText: text("thumbnail_text"),
  shortSummary: text("short_summary"),
  analysis: text("analysis"),
  structure: text("structure"),
  /**
   * The promise made by the title + thumbnail, indicating what the video is about
   */
  promise: text("promise"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
