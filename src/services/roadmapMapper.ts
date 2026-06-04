import { Roadmap, RoadmapModule } from "@/types";

export function mapRoadmap(rawRoadmap: any): Roadmap {
  const title = typeof rawRoadmap?.title === 'string' && rawRoadmap.title.trim().length > 0 
    ? rawRoadmap.title 
    : 'My Career Roadmap';
  const description = typeof rawRoadmap?.description === 'string' && rawRoadmap.description.trim().length > 0
    ? rawRoadmap.description 
    : 'Your guided career learning path';
  
  const rawModules = Array.isArray(rawRoadmap?.modules) ? rawRoadmap.modules : [];
  
  const modules: RoadmapModule[] = rawModules.map((m: any, index: number) => {
    const rawTitle = typeof m?.title === 'string' && m.title.trim().length > 0
      ? m.title 
      : `Module ${index + 1}`;
    
    // Generate a stable ID from the title if not present
    const baseId = typeof m?.id === 'string' && m.id.trim().length > 0
      ? m.id
      : rawTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      
    const id = baseId || `module-${index + 1}`;
    const desc = typeof m?.description === 'string' && m.description.trim().length > 0
      ? m.description 
      : `Master the skills and topics for ${rawTitle}.`;
    
    // Normalize skills to a non-empty array of strings
    let skills: string[] = [];
    if (Array.isArray(m?.skills)) {
      skills = m.skills.map((s: any) => String(s).trim()).filter(s => s.length > 0);
    } else if (typeof m?.skills === 'string' && m.skills.trim().length > 0) {
      skills = [m.skills.trim()];
    }
    if (skills.length === 0) {
      skills = [rawTitle];
    }

    // Normalize projects to a non-empty array of strings
    let projects: string[] = [];
    if (Array.isArray(m?.projects)) {
      projects = m.projects.map((p: any) => String(p).trim()).filter(p => p.length > 0);
    } else if (typeof m?.projects === 'string' && m.projects.trim().length > 0) {
      projects = [m.projects.trim()];
    }
    if (projects.length === 0) {
      projects = [`Complete a practical project on ${rawTitle}.`];
    }

    return {
      id,
      title: rawTitle,
      description: desc,
      skills,
      projects
    };
  });

  return {
    title,
    description,
    modules,
    meta: rawRoadmap?.meta
  };
}
