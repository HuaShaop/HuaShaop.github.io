export type ProjectStatus = "building" | "shipped" | "paused";

export interface Project {
  /** Display name */
  title: string;
  /** One-line English tagline */
  tagline: string;
  /** Short Chinese description */
  description: string;
  stack: string[];
  status: ProjectStatus;
  year: string;
  demo?: string;
  repo?: string;
}

export const projects: Project[] = [
  {
    title: "Physics Sandbox",
    tagline: "A 2D physics playground that runs entirely in the browser.",
    description:
      "拖拽刚体、调重力、加约束——一套手写的轻量物理模拟，打开网页就能玩。",
    stack: ["TypeScript", "Canvas", "Vite"],
    status: "building",
    year: "2026",
    demo: "https://huashaop.github.io/physics-sandbox/",
    repo: "https://github.com/HuaShaop/physics-sandbox",
  },
];
