import { notFound } from "next/navigation";
import ProjectOverlay from "@/components/ProjectOverlay";
import ProjectDetail from "@/components/ProjectDetail";
import { PROJECTS, getProject } from "@/utils/projects";

/**
 * Intercepted /work/<slug>: when a portfolio card is clicked on the home page,
 * the project opens in this overlay and the home page stays mounted beneath
 * it. (Visiting /work/<slug> directly renders app/work/[slug]/page.tsx.)
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectModal({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  return (
    <ProjectOverlay title={p.title}>
      <ProjectDetail p={p} mode="overlay" />
    </ProjectOverlay>
  );
}
