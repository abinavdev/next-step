import type { CareerPath } from "@/types";

export const allCareers: CareerPath[] = [
  {
    id: "1",
    title: "Software Engineer",
    description:
      "Build scalable applications and solve complex problems with code. Work on frontend, backend, or full-stack development.",
    matchPercentage: 92,
    requiredSkills: ["JavaScript", "React", "Node.js", "System Design", "DSA"],
    averageSalary: "$120k",
    growthRate: "+22%",
    icon: "Code",
  },
  {
    id: "2",
    title: "Data Scientist",
    description:
      "Extract insights from data, build ML models, and drive data-driven decisions across organizations.",
    matchPercentage: 78,
    requiredSkills: ["Python", "Machine Learning", "Statistics", "SQL", "TensorFlow"],
    averageSalary: "$130k",
    growthRate: "+36%",
    icon: "BarChart3",
  },
  {
    id: "3",
    title: "Product Manager",
    description:
      "Lead product strategy, prioritize features, and bridge business needs with technology solutions.",
    matchPercentage: 65,
    requiredSkills: ["Strategy", "Analytics", "Communication", "Agile", "User Research"],
    averageSalary: "$140k",
    growthRate: "+18%",
    icon: "Target",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    description:
      "Automate infrastructure, manage CI/CD pipelines, and ensure system reliability at scale.",
    matchPercentage: 70,
    requiredSkills: ["Docker", "Kubernetes", "AWS", "Linux", "Terraform"],
    averageSalary: "$125k",
    growthRate: "+28%",
    icon: "Settings",
  },
  {
    id: "5",
    title: "UX Designer",
    description:
      "Create intuitive user experiences through research, prototyping, and visual design.",
    matchPercentage: 55,
    requiredSkills: [
      "Figma",
      "User Research",
      "Prototyping",
      "Visual Design",
      "Usability Testing",
    ],
    averageSalary: "$105k",
    growthRate: "+15%",
    icon: "Palette",
  },
  {
    id: "6",
    title: "Machine Learning Engineer",
    description:
      "Design and deploy ML systems at scale, bridging research and production.",
    matchPercentage: 72,
    requiredSkills: ["Python", "PyTorch", "MLOps", "Deep Learning", "Cloud Platforms"],
    averageSalary: "$145k",
    growthRate: "+42%",
    icon: "Brain",
  },
  {
    id: "7",
    title: "Cybersecurity Analyst",
    description:
      "Protect organizations from cyber threats through monitoring, analysis, and incident response.",
    matchPercentage: 60,
    requiredSkills: [
      "Network Security",
      "SIEM",
      "Penetration Testing",
      "Risk Assessment",
      "Compliance",
    ],
    averageSalary: "$110k",
    growthRate: "+33%",
    icon: "Shield",
  },
  {
    id: "8",
    title: "Cloud Architect",
    description:
      "Design and implement cloud infrastructure solutions for enterprise applications.",
    matchPercentage: 68,
    requiredSkills: ["AWS", "Azure", "Architecture", "Networking", "Security"],
    averageSalary: "$155k",
    growthRate: "+25%",
    icon: "Cloud",
  },
];

