import { notFound } from "next/navigation";
import ProjectOverlay from "@/components/ProjectOverlay";
import ServiceDetail from "@/components/ServiceDetail";
import { SERVICE_PAGES, getServicePage } from "@/utils/services";

/**
 * Intercepted /services/<slug>: from the home page's footer or Services
 * section, the service opens in this overlay and the home page stays mounted
 * beneath it — "All services" (or Back) returns to exactly where you were,
 * with no reload. (Visiting /services/<slug> directly renders
 * app/services/[slug]/page.tsx, which search engines see.)
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }));
}

export default async function ServiceModal({ params }: { params: Promise<{ slug: string }> }) {
  const s = getServicePage((await params).slug);
  if (!s) notFound();
  return (
    <ProjectOverlay title={s.name} backLabel="All services" closeLabel="Close service" labelledBy="service-title">
      <ServiceDetail s={s} mode="overlay" />
    </ProjectOverlay>
  );
}
