import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | davidasix",
  description: "Thoughts, projects, and learnings from David A Six",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
