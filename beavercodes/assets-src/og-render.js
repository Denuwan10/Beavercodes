// Render the 1200×630 share card with the site's own fonts (loaded from the
// running dev server) and brand assets. Usage: node og-render.js <playwright> <base> <outJpg>
const pw = require(process.argv[2]);
const BASE = process.argv[3];
const OUT = process.argv[4];
const html = `
<div id="og" style="position:fixed;inset:0;width:1200px;height:630px;overflow:hidden;background:#0c0a09;color:#f2ebe1;font-family:var(--font-manrope),sans-serif;">
  <div style="position:absolute;inset:0;background-image:linear-gradient(to right,rgba(242,235,225,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(242,235,225,.045) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse at 70% 50%,#000 25%,transparent 80%);"></div>
  <div style="position:absolute;right:-180px;bottom:-260px;width:820px;height:720px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,122,26,.42),rgba(255,122,26,.08) 60%,transparent);filter:blur(30px);"></div>
  <div style="position:absolute;left:0;top:0;bottom:0;width:6px;background:linear-gradient(#ff7a1a,#ffb35c);"></div>

  <div style="position:absolute;left:72px;top:60px;display:flex;align-items:center;gap:14px;">
    <img src="/brand/beaver-mark.png" style="height:52px" />
    <span style="font-size:30px;font-weight:800;letter-spacing:-.02em"><span style="color:#c9824f">Beaver</span><span>Codes</span></span>
  </div>

  <div style="position:absolute;left:72px;top:178px;width:640px;">
    <div style="font-size:66px;font-weight:700;line-height:1.02;letter-spacing:-.045em;">Your business deserves a <span style="color:#ff7a1a">stronger</span> digital future.</div>
    <div style="margin-top:28px;white-space:nowrap;font-size:25px;line-height:1.4;color:#a39789;">Websites, software, mobile apps &amp; digital marketing.</div>
  </div>

  <div style="position:absolute;left:72px;bottom:58px;display:flex;align-items:center;gap:18px;font-family:var(--font-jetbrains),monospace;font-size:17px;letter-spacing:.18em;text-transform:uppercase;color:#a39789;">
    <span style="display:block;width:44px;height:1px;background:rgba(255,122,26,.7)"></span>
    Sri Lanka <span style="color:#ff7a1a">•</span> Worldwide
    <span style="margin-left:26px;color:#f2ebe1;letter-spacing:.08em;text-transform:none;">beavercodes.com</span>
  </div>

  <img src="/brand/beaver-mark.png" style="position:absolute;right:56px;top:50%;transform:translateY(-46%);width:430px;filter:drop-shadow(0 40px 60px rgba(0,0,0,.6));" />
</div>`;
(async () => {
  const b = await pw.chromium.launch({ channel: "chrome" });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })).newPage();
  await p.goto(BASE + "/privacy-policy", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  await p.evaluate((h) => {
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;inset:0;z-index:2147483647";
    host.innerHTML = h;
    document.documentElement.appendChild(host);
  }, html);
  await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); });
  await p.waitForTimeout(500);
  console.log("fonts:", await p.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family).join(", ")));
  await p.screenshot({ path: OUT, type: "jpeg", quality: 90, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await b.close();
})();
