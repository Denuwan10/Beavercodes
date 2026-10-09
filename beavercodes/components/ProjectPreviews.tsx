/**
 * Illustrative, code-drawn project previews (no image weight, crisp at any
 * size). Swap these for real screenshots via the `image` field in Portfolio.
 */

function Browser({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] ${dark ? "bg-[#161311]" : "bg-[#f4ede3]"}`}>
      <div className={`flex items-center gap-1.5 px-4 py-3 ${dark ? "bg-[#1f1b18]" : "bg-[#e6ddd0]"}`}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span className={`ml-4 h-4 flex-1 rounded-full ${dark ? "bg-white/5" : "bg-black/5"}`} />
      </div>
      {children}
    </div>
  );
}

export function BusinessSitePreview() {
  return (
    <Browser>
      <div className="grid grid-cols-5 gap-6 p-[6%]">
        <div className="col-span-3 flex flex-col justify-center gap-3">
          <div className="h-2 w-16 rounded-full bg-[#ff7a1a]" />
          <div className="text-[clamp(1rem,2.4vw,2.1rem)] font-extrabold leading-[1.02] tracking-tight text-[#14110f]">
            Consulting that
            <br />
            <span className="font-serif font-normal italic text-[#c4561a]">moves</span> markets.
          </div>
          <div className="mt-1 h-2 w-4/5 rounded-full bg-black/10" />
          <div className="h-2 w-3/5 rounded-full bg-black/10" />
          <div className="mt-3 flex gap-2">
            <div className="h-7 w-24 rounded-full bg-[#14110f]" />
            <div className="h-7 w-20 rounded-full border border-black/20" />
          </div>
        </div>
        <div className="col-span-2 aspect-[4/5] rounded-lg bg-gradient-to-br from-[#ff9a4d] to-[#c4561a]" />
        <div className="col-span-5 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-black/[0.06]" />
          ))}
        </div>
      </div>
    </Browser>
  );
}

export function EcommercePreview() {
  const tones = ["#d8b38c", "#7a4a2b", "#ff7a1a", "#3a2a20", "#e9dccb", "#b0673a"];
  return (
    <Browser dark>
      <div className="p-[5%]">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-sm font-extrabold tracking-[0.2em] text-[#f2ebe1]">TIMBER&amp;CO</div>
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-white/10" />
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff7a1a] text-[10px] font-bold text-black">3</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {tones.map((t, i) => (
            <div key={i} className="rounded-lg bg-white/[0.04] p-2">
              <div className="aspect-square rounded-md" style={{ background: `linear-gradient(140deg, ${t}, #120f0d)` }} />
              <div className="mt-2 h-1.5 w-3/4 rounded-full bg-white/20" />
              <div className="mt-1.5 flex items-center justify-between">
                <div className="h-1.5 w-1/3 rounded-full bg-[#ffb35c]/70" />
                <div className="h-4 w-4 rounded-full bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Browser>
  );
}

function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[9/19] w-[34%] rounded-[2rem] bg-[#0d0b0a] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 ${className ?? ""}`}>
      <div className="absolute left-1/2 top-3 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
      <div className="h-full w-full overflow-hidden rounded-[1.6rem] bg-[#f4ede3]">{children}</div>
    </div>
  );
}

export function MobileAppPreview() {
  return (
    <div className="flex items-end justify-center gap-[6%]">
      <Phone className="translate-y-6 -rotate-6">
        <div className="flex h-full flex-col gap-2 p-3 pt-10">
          <div className="text-[10px] font-semibold text-black/50">Good morning</div>
          <div className="text-base font-extrabold leading-tight text-[#14110f]">Your fitness</div>
          <div className="mt-1 flex aspect-square items-center justify-center rounded-2xl bg-[#ff7a1a]">
            <div className="h-1/2 w-1/2 rounded-full border-[6px] border-black/80 border-r-transparent" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-8 rounded-xl bg-black/[0.06]" />
          ))}
        </div>
      </Phone>
      <Phone className="-translate-y-2 rotate-3">
        <div className="flex h-full flex-col bg-[#14110f] p-3 pt-10">
          <div className="text-[10px] font-semibold text-white/50">Balance</div>
          <div className="text-xl font-extrabold text-[#f2ebe1]">$12,480</div>
          <div className="mt-3 flex h-20 items-end gap-1">
            {[30, 50, 40, 70, 55, 85, 95].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 6 ? "#ff7a1a" : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2">
            <div className="h-10 rounded-xl bg-[#ff7a1a]" />
            <div className="h-10 rounded-xl bg-white/10" />
          </div>
        </div>
      </Phone>
    </div>
  );
}

export function ManagementSystemPreview() {
  return (
    <Browser dark>
      <div className="grid grid-cols-[22%_1fr]">
        <div className="space-y-2 border-r border-white/5 p-3">
          <div className="mb-4 h-5 w-5 rounded-md bg-[#ff7a1a]" />
          {["Overview", "Orders", "Inventory", "Staff", "Reports"].map((l, i) => (
            <div key={l} className={`rounded-md px-2 py-1.5 text-[10px] ${i === 0 ? "bg-white/10 text-white" : "text-white/40"}`}>
              {l}
            </div>
          ))}
        </div>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Revenue", "$84.2k"],
              ["Orders", "1,284"],
              ["Growth", "+32%"],
            ].map(([k, v], i) => (
              <div key={k} className="rounded-lg bg-white/[0.04] p-2.5">
                <div className="text-[9px] uppercase tracking-wider text-white/40">{k}</div>
                <div className={`text-sm font-bold ${i === 2 ? "text-[#ffb35c]" : "text-white"}`}>{v}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-white/[0.04] p-3">
            <svg viewBox="0 0 200 60" className="h-20 w-full" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="g-dash" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ff7a1a" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 50 L25 42 L50 45 L75 30 L100 34 L125 20 L150 24 L175 10 L200 6 L200 60 L0 60 Z" fill="url(#g-dash)" />
              <path d="M0 50 L25 42 L50 45 L75 30 L100 34 L125 20 L150 24 L175 10 L200 6" fill="none" stroke="#ff7a1a" strokeWidth="1.5" />
            </svg>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2 py-1.5">
              <div className="h-4 w-4 rounded-full bg-white/10" />
              <div className="h-1.5 flex-1 rounded-full bg-white/10" />
              <div className={`h-3 w-10 rounded-full ${i === 0 ? "bg-[#ff7a1a]/70" : "bg-white/10"}`} />
            </div>
          ))}
        </div>
      </div>
    </Browser>
  );
}
