"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";
import Container from "@/components/ui/Container";
import CartButton from "@/components/cart/CartButton";

const navLinks = [
  { href: "/", label: "Inicio", match: "home" },
  { href: "/productos", label: "Productos", match: "productos" },
  { href: "/agua-alcalina", label: "Agua Alcalina", match: "alcalina" },
  { href: "/nuestra-planta", label: "Nuestra Planta", match: "planta" },
  { href: "/#ayuda", label: "Contactos", match: "contactos" },
] as const;

const SCROLL_DELTA = 8;
const HIDE_AFTER = 72;

export default function Header() {
  const pathname = usePathname();
  const [onContact, setOnContact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (pathname !== "/") {
      setOnContact(false);
      return;
    }

    const syncFromHash = () => {
      setOnContact(window.location.hash === "#ayuda");
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    const node = document.getElementById("ayuda");
    if (!node) {
      return () => window.removeEventListener("hashchange", syncFromHash);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          setOnContact(true);
        } else if (window.scrollY < 180) {
          setOnContact(false);
        } else if (!entry.isIntersecting) {
          setOnContact(window.location.hash === "#ayuda");
        }
      },
      { rootMargin: "-25% 0px -40% 0px", threshold: [0.25, 0.5] },
    );

    observer.observe(node);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (menuOpen || y < HIDE_AFTER) {
        setHidden(false);
      } else if (delta > SCROLL_DELTA) {
        setHidden(true);
      } else if (delta < -SCROLL_DELTA) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const isActive = (match: (typeof navLinks)[number]["match"]) => {
    if (match === "productos") {
      return pathname === "/productos" || pathname.startsWith("/productos/");
    }
    if (match === "alcalina") {
      return pathname === "/agua-alcalina";
    }
    if (match === "planta") {
      return pathname === "/nuestra-planta";
    }
    if (match === "contactos") {
      return pathname === "/" && onContact;
    }
    return pathname === "/" && !onContact;
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="relative z-50 border-b border-brand/6 bg-background/90 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandLogo size="sm" priority />
            <span className="truncate text-sm font-extrabold tracking-wide text-brand sm:text-base">
              Agua Ser{" "}
              <span className="font-semibold text-brand-accent">Plus</span>
            </span>
          </div>

          <nav
            aria-label="Principal"
            className="hidden items-center gap-7 lg:flex"
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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <CartButton />
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-brand/15 text-brand transition hover:bg-surface lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.75} aria-hidden />
              ) : (
                <Menu className="size-5" strokeWidth={1.75} aria-hidden />
              )}
            </button>
          </div>
        </Container>
      </div>

      <div
        id="mobile-nav"
        className={`lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Cerrar menú"
          onClick={closeMenu}
          className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-[#041a2e]/40 transition-opacity duration-300 sm:top-[72px] ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <nav
          aria-label="Menú móvil"
          className={`absolute inset-x-0 top-full z-50 origin-top border-b border-brand/8 bg-background shadow-[0_24px_48px_-24px_rgb(4_26_46_/_0.35)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
        >
          <Container className="flex flex-col gap-1 py-4 pb-5">
            {navLinks.map((link) => {
              const active = isActive(link.match);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-3 py-3 text-base font-semibold transition ${
                    active
                      ? "bg-brand/8 text-brand"
                      : "text-neutral hover:bg-surface hover:text-brand"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/productos"
              onClick={closeMenu}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-secondary"
            >
              Ver catálogo
            </Link>
          </Container>
        </nav>
      </div>
    </header>
  );
}
