"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function BrandMark() {
  return (
    <Link className="brand-lockup jobly-nav-brand" href="/" aria-label="Jobly home">
      <span className="brand-wordmark">jobly</span>
      <span className="brand-pulse" />
    </Link>
  );
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const jobsActive = pathname === "/jobs" || pathname.startsWith("/jobs/");

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="jobly-navbar">
      <div className="jobly-navbar-inner">
        <BrandMark />

        <nav className="jobly-navbar-links" aria-label="Primary navigation">
          <Link href="/jobs" aria-current={jobsActive ? "page" : undefined} onClick={closeMenu}>Discover jobs</Link>
          <Link href="/#how-it-works" onClick={closeMenu}>How it works</Link>
          <Link href="/#safety" onClick={closeMenu}>Safety first</Link>
        </nav>

        <Link className="jobly-navbar-cta" href="/#stack" onClick={closeMenu}>
          Start swiping <span aria-hidden="true">›</span>
        </Link>

        <button
          className="jobly-navbar-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="jobly-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} size={23} strokeWidth={1.7} />
        </button>
      </div>

      {menuOpen && (
        <nav className="jobly-mobile-navigation" id="jobly-mobile-navigation" aria-label="Mobile navigation">
          <Link href="/jobs" aria-current={jobsActive ? "page" : undefined} onClick={closeMenu}>Discover jobs</Link>
          <Link href="/#how-it-works" onClick={closeMenu}>How it works</Link>
          <Link href="/#safety" onClick={closeMenu}>Safety first</Link>
          <Link className="jobly-mobile-cta" href="/#stack" onClick={closeMenu}>Start swiping <span aria-hidden="true">›</span></Link>
        </nav>
      )}
    </header>
  );
}
