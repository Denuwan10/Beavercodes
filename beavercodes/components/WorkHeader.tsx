import Logo from "./Logo";
import MagneticButton, { Arrow } from "./MagneticButton";

/**
 * Header for project pages: logo home, back to all work, start a project.
 * Plain links (full page loads) — the home page rebuilds its 3D intro and
 * scroll pinning from scratch, then jumps to the #section in the URL.
 */
/** @param backHref where "All work" returns to — the project's own card. */
export default function WorkHeader({ backHref = "/?section=portfolio" }: { backHref?: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/[0.06] bg-ink/75 backdrop-blur-xl">
      <nav className="container-x flex h-20 items-center justify-between gap-4" aria-label="Primary">
        <a href="/" aria-label="BeaverCodes home" data-cursor="hover">
          <Logo />
        </a>
        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href={backHref}
            className="group inline-flex items-center gap-2 text-sm text-cream/75 transition-colors hover:text-cream"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            All work
          </a>
          <div className="hidden sm:block">
            <MagneticButton href="/?section=contact" className="[&_a]:py-3">
              Start a project <Arrow />
            </MagneticButton>
          </div>
        </div>
      </nav>
    </header>
  );
}
