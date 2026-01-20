"use client";

import posthog from "posthog-js";
import type { socials } from "~/lib/constants";

interface SocialLinkProps {
  social: (typeof socials)[number];
}

export function SocialLink({ social }: SocialLinkProps) {
  const { url, icon: SocialIcon, socialMedia, displayName } = social;

  const handleClick = () => {
    posthog.capture("social_link_clicked", {
      social_platform: socialMedia,
      display_name: displayName,
      url: url,
    });
  };

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
