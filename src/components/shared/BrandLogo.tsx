import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/company";

type BrandLogoProps = {
  /** Visual size of the logo mark */
  size?: "sm" | "md" | "lg";
  /** Show white plate behind logo (useful on dark backgrounds) */
  onDark?: boolean;
  className?: string;
  priority?: boolean;
};

const sizeMap = {
  sm: { box: "h-11 w-11", img: 44 },
  md: { box: "h-14 w-14", img: 56 },
  lg: { box: "h-20 w-20", img: 80 },
} as const;

export default function BrandLogo({
  size = "md",
  onDark = false,
  className = "",
  priority = false,
}: BrandLogoProps) {
  const dims = sizeMap[size];

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label={`${company.tradeName} - Inicio`}
    >
      <span
        className={`relative overflow-hidden rounded-full ${dims.box} ${
          onDark
            ? "bg-white shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.45)] ring-1 ring-white/20"
            : "bg-white ring-1 ring-brand/10"
        }`}
      >
        <Image
          src={company.logo.src}
          alt={company.logo.alt}
          width={company.logo.width}
          height={company.logo.height}
          priority={priority}
          className="h-full w-full object-contain p-0.5"
          sizes={`${dims.img}px`}
        />
      </span>
    </Link>
  );
}
