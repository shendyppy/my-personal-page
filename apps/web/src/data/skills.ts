import { Skill, SkillLevel } from "@/types";

export const skills: Skill[] = [
  {
    name: "TypeScript",
    level: 90,
    category: "Frontend",
    logo: "/assets/img/content/typescript.png",
    model: "/assets/models/typescript.glb",
    color: "#3178C6",
  },
  {
    name: "JavaScript",
    level: 95,
    category: "Frontend",
    logo: "/assets/img/content/javascript.png",
    model: "/assets/models/javascript.glb",
    color: "#F7DF1E",
  },
  {
    name: "Vue.js",
    level: 50,
    category: "Frontend",
    logo: "/assets/img/content/vue.png",
    model: "/assets/models/vue.glb",
    color: "#42B883",
  },
  {
    name: "React.js",
    level: 95,
    category: "Frontend",
    logo: "/assets/img/content/react.png",
    model: "/assets/models/react.glb",
    color: "#61DAFB",
  },
  {
    name: "AXIOS",
    level: 90,
    category: "Frontend",
    logo: "/assets/img/content/axios.png",
    model: "/assets/models/axios.glb",
    color: "#5A29E4",
  },
  {
    name: "Redux",
    level: 80,
    category: "Frontend",
    logo: "/assets/img/content/redux.png",
    model: "/assets/models/redux.glb",
    color: "#764ABC",
  },
  {
    name: "Jest",
    level: 70,
    category: "Frontend",
    logo: "/assets/img/content/jest.png",
    model: "/assets/models/jest.glb",
    color: "#C21325",
  },
  {
    name: "Python",
    level: 40,
    category: "Backend",
    logo: "/assets/img/content/python.png",
    model: "/assets/models/python.glb",
    color: "#3776AB",
  },
  {
    name: "Node.js",
    level: 60,
    category: "Backend",
    logo: "/assets/img/content/nodejs.png",
    model: "/assets/models/nodejs.glb",
    color: "#339933",
  },
  {
    name: "Sequelize",
    level: 50,
    category: "Backend",
    logo: "/assets/img/content/sequelize.png",
    model: "/assets/models/sequelize.glb",
    color: "#52B0E7",
  },
  {
    name: "Github Actions",
    level: 60,
    category: "DevOps",
    logo: "/assets/img/content/github-actions.png",
    model: "/assets/models/github-actions.glb",
    color: "#2088FF",
  },
  {
    name: "AWS",
    level: 50,
    category: "DevOps",
    logo: "/assets/img/content/aws.png",
    model: "/assets/models/aws.glb",
    color: "#FF9900",
  },
  {
    name: "cPanel",
    level: 50,
    category: "DevOps",
    logo: "/assets/img/content/cPanel.png",
    model: "/assets/models/cPanel.glb",
    color: "#FF6C2C",
  },
  {
    name: "Firebase",
    level: 75,
    category: "DevOps",
    logo: "/assets/img/content/firebase.png",
    model: "/assets/models/firebase.glb",
    color: "#FFCA28",
  },
  {
    name: "PostgreSQL",
    level: 60,
    category: "Database",
    logo: "/assets/img/content/postgresql.png",
    model: "/assets/models/postgresql.glb",
    color: "#336791",
  },
];

export const getLevelLabel = (level: number): SkillLevel => {
  if (level >= 90) return "Expert";
  if (level >= 70) return "Advanced";
  if (level >= 50) return "Intermediate";
  return "Beginner";
};

export const getSkillsByCategory = (category: string): Skill[] => {
  if (category === "All") return skills;
  return skills.filter((s) => s.category === category);
};
