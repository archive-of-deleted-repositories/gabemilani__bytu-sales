"use client";

import { track } from "@vercel/analytics";
import type { ComponentProps, MouseEvent } from "react";

type TrackLinkProps = ComponentProps<"a"> & {
  event: string;
  eventData?: Record<string, string | number | boolean>;
};

/**
 * Link comum que dispara um evento do Vercel Analytics ao ser clicado.
 */
export function TrackLink({
  event,
  eventData,
  onClick,
  ...props
}: TrackLinkProps) {
  return (
    <a
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        track(event, eventData);
        onClick?.(e);
      }}
    />
  );
}
