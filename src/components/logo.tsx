import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

/**
 * Renders the BYTU logo, swapping to the dark variant when the dark theme is
 * active. Both images are rendered and toggled via Tailwind's `dark:` variant
 * (theme is set with `attribute="class"`), avoiding hydration flicker.
 */
export function Logo({ width, height, className, priority }: LogoProps) {
  return (
    <>
      <Image
        src="/images/logo.png"
        alt="BYTU"
        width={width}
        height={height}
        className={cn("dark:hidden", className)}
        priority={priority}
      />
      <Image
        src="/images/dark_logo.png"
        alt="BYTU"
        width={width}
        height={height}
        className={cn("hidden dark:block", className)}
        priority={priority}
      />
    </>
  );
}
