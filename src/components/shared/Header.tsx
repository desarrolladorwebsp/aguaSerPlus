"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/shared/BrandLogo";
import Container from "@/components/ui/Container";
import CartButton from "@/components/cart/CartButton";

const navLinks = [
  { href: "/", label: "Inicio", match: "home" },
  { href: "/productos", label: "Productos", match: "productos" },
  { href: "/nuestra-planta", label: "Nuestra Planta", match: "planta" },
  { href: "/#ofertas", label: "Ofertas", match: "ofertas" },
  { href: "/#alcalina", label: "Agua Alcalina", match: "alcalina" },
  { href: "/#recargas", label: "Recargas", match: "recargas" },
  { href: "/#ayuda", label: "Ayuda", match: "ayuda" },
] as const;

const sectionIds = ["ofertas", "alcalina", "recargas", "ayuda"] as const;

export default function Header() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveSection(sectionIds.includes(hash as (typeof sectionIds)[number]) ? hash : null);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId && bestRatio > 0.15) {
          setActiveSection(bestId);
        } else if (window.scrollY < 180) {
          setActiveSection(null);
        }
      },
      {
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0.15, 0.35, 0.55, 0.75],
      },
    );

    for (const id of sectionIds) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      observer.disconnect();
    };
  }, [pathname]);

  const isActive = (match: (typeof navLinks)[number]["match"]) => {
    if (match === "productos") {
      return pathname === "/productos" || pathname.startsWith("/productos/");
    }
    if (match === "planta") {
      return pathname === "/nuestra-planta";
    }
    if (match === "home") {
      return pathname === "/" && !activeSection;
    }
    return pathname === "/" && activeSection === match;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand/6 bg-background/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" priority />
          <span className="hidden text-base font-extrabold tracking-wide text-brand sm:inline">
            Agua Ser <span className="font-semibold text-brand-accent">Plus</span>
          </span>
        </div>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-6 lg:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-sm font-semibold transition ${
                  active
                    ? "text-brand"
                    : "font-medium text-neutral hover:text-brand"
                }`}
              >
                {link.label}
                <span
                  aria-hidden
                  className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-brand-accent transition-all duration-300 ${
                    active ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <CartButton />
        </div>
      </Container>
    </header>
  );
}
