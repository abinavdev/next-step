import { model } from "@/lib/gemini";
import { careerRoadmaps } from "@/data/careerRoadmaps";
import { Roadmap } from "@/types";

export async function generateRoadmap(careerGoal: string): Promise<Roadmap> {
  const prompt = `You are an expert career and learning path assistant. Generate a highly structured, professional, and comprehensive learning roadmap for someone aiming to become a "${careerGoal}".
Return ONLY a valid JSON object matching the following structure. Do not include markdown formatting like \`\`\`json or any other text before/after the JSON.

JSON Structure:
{
  "title": "Roadmap title",
  "description": "General description of the career path and roadmap",
  "modules": [
    {
      "id": "module-unique-id-slug",
      "title": "Module Title",
      "description": "Short description of what is covered in this module",
      "skills": ["Skill 1", "Skill 2"],
      "projects": ["Project Idea 1"]
    }
  ]
}

Provide between 4 to 8 sequential modules in order of learning. Give realistic skills and practical project ideas.`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Strip markdown formatting if Gemini included it
    if (text.startsWith("```json")) {
      text = text.substring(7);
    } else if (text.startsWith("```")) {
      text = text.substring(3);
    }
    if (text.endsWith("```")) {
      text = text.substring(0, text.length - 3);
    }
    text = text.trim();
    
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error("Gemini roadmap generation failed, falling back to static roadmap:", error);
    return getFallbackRoadmap(careerGoal);
  }
}

function getFallbackRoadmap(careerGoal: string): Roadmap {
  const slug = careerGoal.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  const nodes = careerRoadmaps[slug] || careerRoadmaps["software-engineer"];
  
  return {
    title: `${careerGoal} Learning Roadmap`,
    description: `A guided learning path to master the skills needed to become a ${careerGoal}.`,
    modules: nodes.map((node) => ({
      id: node.id,
      title: node.title,
      description: node.description || `Learn the fundamentals and applications of ${node.title}.`,
      skills: [node.title],
      projects: [`Build a practical project applying ${node.title} concepts.`],
    })),
    meta: {
      source: "fallback"
    }
  };
}
