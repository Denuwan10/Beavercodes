"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading, { Serif } from "./SectionHeading";
import {
  BusinessSitePreview,
  EcommercePreview,
  ManagementSystemPreview,
  MobileAppPreview,
} from "./ProjectPreviews";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  title: string;
  category: string;
  summary: string;
  tags: string[];
  bg: string;
  Preview: () => React.ReactElement;
  /** Device frame around the code-drawn preview. */
  frame?: "laptop" | "monitor";
  /**
   * Optional real screenshot (e.g. /work/business-site.jpg, or a Higgsfield
   * render registered in utils/assets.ts). When set it replaces the drawn preview.
   */
  image?: string;
};

/** Thin aluminium laptop frame — makes website previews read as real products. */
function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full">
      <div className="rounded-t-[18px] border border-white/10 bg-[#0b0a0a] p-[2.2%] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
        <div className="overflow-hidden rounded-[6px]">{children}</div>
      </div>
      <div className="relative mx-[-6%] h-[14px] rounded-b-[14px] bg-gradient-to-b from-[#b9b4ae] to-[#6f6b67]">
        <div className="absolute left-1/2 top-0 h-[5px] w-[16%] -translate-x-1/2 rounded-b-md bg-black/25" />
      </div>
    </div>
  );
}

/** Studio display frame for dashboards. */
function MonitorFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full flex-col items-center">
      <div className="w-full rounded-[14px] border border-white/10 bg-[#0b0a0a] p-[1.6%] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
        <div className="overflow-hidden rounded-[6px]">{children}</div>
      </div>
      <div className="h-[22px] w-[12%] bg-gradient-to-b from-[#8f8a85] to-[#5d5955]" />
      <div className="h-[6px] w-[26%] rounded-full bg-[#7b7671]" />
    </div>
  );
}

function Shot({ p }: { p: Project }) {
  // eslint-disable-next-line @next/next/no-img-element
  const inner = p.image ? <img src={p.image} alt={`${p.title} screenshot`} className="block h-auto w-full" loading="lazy" /> : <p.Preview />;
  if (p.frame === "laptop") return <LaptopFrame>{inner}</LaptopFrame>;
  if (p.frame === "monitor") return <MonitorFrame>{inner}</MonitorFrame>;
  return inner;
}

const PROJECTS: Project[] = [
  {
    title: "Business Website",
    category: "Web Development",
    summary: "A conversion-focused corporate site with a fast CMS and a brand that finally feels premium.",
    tags: ["Next.js", "Headless CMS", "SEO"],
    bg: "linear-gradient(150deg, #2a1a10 0%, #120d0a 70%)",
    Preview: BusinessSitePreview,
    frame: "laptop",
  },
  {
    title: "E-Commerce Platform",
    category: "Web & Software",
    summary: "A storefront and back-office built to scale, with checkout tuned for speed on every device.",
    tags: ["Storefront", "Payments", "Inventory"],
    bg: "linear-gradient(150deg, #3b1f0f 0%, #140e0a 70%)",
    Preview: EcommercePreview,
  },
  {
    title: "Mobile Application",
    category: "Mobile App Development",
    summary: "Native-feeling iOS and Android apps from one codebase — smooth, accessible and delightful.",
    tags: ["iOS", "Android", "React Native"],
    bg: "linear-gradient(150deg, #4a2511 0%, #160f0b 70%)",
    Preview: MobileAppPreview,
  },
  {
    title: "Business Management System",
    category: "Software Development",
    summary: "One dashboard for orders, staff and reporting — replacing five spreadsheets and a lot of stress.",
    tags: ["Dashboard", "Roles & Permissions", "Reports"],
    bg: "linear-gradient(150deg, #2d1c12 0%, #100c0a 70%)",
    Preview: ManagementSystemPreview,
    frame: "monitor",
  },
];

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--rx", `${-y * 5}deg`);
    e.currentTarget.style.setProperty("--ry", `${x * 7}deg`);
  };
  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <article className="portfolio-card group w-full shrink-0 lg:w-[min(72vw,1040px)]">
      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        data-cursor="view"
        data-cursor-label="View"
        className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-cream/10 [perspective:1200px] md:aspect-[16/10]"
        style={{ background: p.bg }}
      >
        <div aria-hidden className="blueprint absolute inset-0 opacity-60" />
        <div
          className="absolute inset-0 flex items-center justify-center p-[7%] transition-transform duration-[900ms] ease-[var(--ease-out-expo)] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] group-hover:scale-[1.035]"
        >
          <div className="w-full max-w-[720px]">
            <Shot p={p} />
          </div>
        </div>
        <div className="absolute left-6 top-6 flex items-center gap-3 md:left-8 md:top-8">
          <span className="rounded-full bg-ink/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-cream/80 backdrop-blur">
            {p.category}
          </span>
        </div>
        <span className="absolute right-6 top-6 font-mono text-xs text-cream/50 md:right-8 md:top-8">
          {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-extrabold tracking-tight">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_2px]">
            {p.title}
          </span>
        </h3>
        <div className="max-w-md">
          <p className="text-mute">{p.summary}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <li key={t} className="font-mono text-[11px] uppercase tracking-wider text-cream/50">
                · {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  // Desktop: pinned horizontal gallery. Below lg: natural vertical scroll.
  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current;
      if (!el) return;
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      // Gentle parallax on each preview while the track moves.
      gsap.utils.toArray<HTMLElement>(".portfolio-card").forEach((card) => {
        gsap.fromTo(card, { opacity: 0.55 }, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 90%",
            end: "left 40%",
            scrub: true,
          },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="portfolio" ref={section} className="relative overflow-hidden bg-ink py-[clamp(5rem,10vw,8rem)] lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0">
      <div ref={track} className="flex flex-col gap-20 px-[var(--gutter)] lg:w-max lg:flex-row lg:items-center lg:gap-[6vw]">
        <div className="shrink-0 lg:w-[34vw]">
          <SectionHeading
            index="02"
            label="Portfolio"
            title={[
              "Built in",
              <>
                the <Serif>workshop.</Serif>
              </>,
            ]}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-8 max-w-sm text-mute md:text-lg"
          >
            A look at the kinds of products we craft — each one engineered for performance and designed to grow with the business behind it.
          </motion.p>
          <p className="eyebrow mt-10 hidden items-center gap-3 lg:flex">
            Keep scrolling <span className="text-ember">→</span>
          </p>
        </div>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} p={p} i={i} />
        ))}
        <div className="hidden w-[4vw] shrink-0 lg:block" />
      </div>
      <div className="absolute bottom-10 left-[var(--gutter)] right-[var(--gutter)] hidden h-px bg-cream/10 lg:block">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-ember" />
      </div>
    </section>
  );
}
