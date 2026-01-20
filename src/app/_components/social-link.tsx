"use client";

import posthog from "posthog-js";
import {
  Instagram,
  Github,
  Mail,
  Linkedin,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import type { socials } from "./socials";

const iconMap: Record<string, LucideIcon> = {
  instagram: Instagram,
  email: Mail,
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
};

export function SocialLink({ social }: { social: (typeof socials)[number] }) {
  const { url, socialMedia, displayName } = social;
  const SocialIcon = iconMap[socialMedia];

  const handleClick = () => {
    posthog.capture("social_link_clicked", {
      social_platform: socialMedia,
      display_name: displayName,
      url: url,
    });
  };

  if (!SocialIcon) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="bg-background/30 blur-li flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm"
    >
      <SocialIcon className="text-foreground/80 h-8 w-8" />
    </a>
  );
}
