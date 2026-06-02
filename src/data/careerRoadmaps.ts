export interface CareerRoadmapNode {
  id: string;
  title: string;
  description?: string;
  prerequisites?: string[];
  state?: 'locked' | 'available' | 'completed';
}

export const careerRoadmaps: Record<string, CareerRoadmapNode[]> = {
  "software-engineer": [
    { id: "programming", title: "Programming Basics" },
    { id: "htmlcss", title: "HTML & CSS", prerequisites: ["programming"] },
    { id: "javascript", title: "JavaScript", prerequisites: ["htmlcss"] },
    { id: "react", title: "React Framework", prerequisites: ["javascript"] },
    { id: "api", title: "API Integration", prerequisites: ["react"] },
    { id: "fullstack", title: "Full Stack Development", prerequisites: ["api"] },
    { id: "devops", title: "Deployment & CI/CD", prerequisites: ["fullstack"] },
    { id: "systemdesign", title: "System Design", prerequisites: ["devops"] }
  ],

  "data-scientist": [
    { id: "python", title: "Python Programming" },
    { id: "math", title: "Statistics & Probability", prerequisites: ["python"] },
    { id: "wrangling", title: "Data Wrangling & Cleaning", prerequisites: ["python"] },
    { id: "viz", title: "Data Visualization", prerequisites: ["math", "wrangling"] },
    { id: "ml", title: "Machine Learning Basics", prerequisites: ["math"] },
    { id: "eval", title: "Model Evaluation", prerequisites: ["ml"] },
    { id: "deep", title: "Deep Learning", prerequisites: ["ml"] },
    { id: "deploy", title: "Model Deployment", prerequisites: ["eval"] }
  ],

  "machine-learning-engineer": [
    { id: "python", title: "Python & Algorithms" },
    { id: "ml", title: "Machine Learning Foundations", prerequisites: ["python"] },
    { id: "mlops", title: "MLOps & Pipelines", prerequisites: ["ml"] },
    { id: "deploy", title: "Model Deployment", prerequisites: ["mlops"] },
    { id: "distributed", title: "Distributed Training", prerequisites: ["deploy"] },
    { id: "monitor", title: "Monitoring & Drift Detection", prerequisites: ["deploy"] }
  ],

  "devops-engineer": [
    { id: "linux", title: "Linux Fundamentals" },
    { id: "networking", title: "Networking Basics", prerequisites: ["linux"] },
    { id: "scripting", title: "Bash/Python Scripting", prerequisites: ["linux"] },
    { id: "cloud", title: "Cloud Platforms", prerequisites: ["networking"] },
    { id: "cicd", title: "CI/CD Pipelines", prerequisites: ["cloud"] },
    { id: "docker", title: "Containerization (Docker)", prerequisites: ["cicd"] },
    { id: "k8s", title: "Orchestration (Kubernetes)", prerequisites: ["docker"] },
    { id: "terraform", title: "Infrastructure as Code", prerequisites: ["k8s"] }
  ],

  "product-manager": [
    { id: "strategy", title: "Product Strategy Basics" },
    { id: "research", title: "User Research & UX", prerequisites: ["strategy"] },
    { id: "analytics", title: "Analytics & Metrics", prerequisites: ["research"] },
    { id: "roadmapping", title: "Roadmapping & Prioritization", prerequisites: ["analytics"] },
    { id: "delivery", title: "Delivery & Execution", prerequisites: ["roadmapping"] },
    { id: "communication", title: "Communication & Stakeholders", prerequisites: ["research"] }
  ],

  "cybersecurity-analyst": [
    { id: "network", title: "Networking Fundamentals" },
    { id: "security", title: "Security Principles", prerequisites: ["network"] },
    { id: "siem", title: "SIEM & Monitoring", prerequisites: ["security"] },
    { id: "pentesting", title: "Penetration Testing Basics", prerequisites: ["security"] },
    { id: "incident", title: "Incident Response", prerequisites: ["siem"] },
    { id: "compliance", title: "Compliance & Standards", prerequisites: ["security"] }
  ],

  "cloud-architect": [
    { id: "cloud", title: "Cloud Fundamentals" },
    { id: "providers", title: "AWS / Azure / GCP", prerequisites: ["cloud"] },
    { id: "networking", title: "Cloud Networking", prerequisites: ["providers"] },
    { id: "compute", title: "Compute & Storage", prerequisites: ["providers"] },
    { id: "architect", title: "Architectural Patterns", prerequisites: ["compute"] },
    { id: "security", title: "Cloud Security", prerequisites: ["networking"] },
    { id: "devops", title: "DevOps on Cloud", prerequisites: ["architect"] }
  ],

  "ux-designer": [
    { id: "principles", title: "UX Design Principles" },
    { id: "research", title: "User Research & Personas", prerequisites: ["principles"] },
    { id: "wireframes", title: "Wireframing", prerequisites: ["research"] },
    { id: "prototypes", title: "Prototyping", prerequisites: ["wireframes"] },
    { id: "testing", title: "Usability Testing", prerequisites: ["prototypes"] },
    { id: "handoff", title: "Design Handoff", prerequisites: ["testing"] }
  ]
};

export default careerRoadmaps;
