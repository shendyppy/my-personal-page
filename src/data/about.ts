import {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Twitter,
} from "lucide-react";

import { TechStack, Love } from "@/types";

export const professionalBio = {
  title: "Professional Dreamer",
  content: `I began my career as a civil engineer, but curiosity soon pulled me into tech (during the pandemic I challenged myself to switch paths by joining a coding bootcamp). Growing up as a gamer — and still one today — I was always fascinated by how those worlds were built. Realizing that a few lines of code could bring something interactive to life was game-changing. Since then, I've been all-in on front-end craft: experimenting with 3D on the web, and polishing interfaces that feel playful and intuitive.`,
};

export const currentLearningJourney = `Recently, I've been revisiting the backend, DevOps, and even dipping my toes into LLMs — learning my way through Node.js, Nest.js, ORMs, Python, and the world of CI/CD and deployment. I'm still early on this path, but my aim is clear: to eventually feel just as comfortable building systems behind the scenes as I do shaping the UI up front.`;

export const socialLinks = [
  {
    href: "https://github.com/shendyppy",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/shendyppy/",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "https://www.instagram.com/shendyppy/",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://www.twitter.com/shendyppy/",
    icon: Twitter,
    label: "Twitter",
  },
  {
    href: "mailto:shendyppy@gmail.com?subject=Hello Shendy&body=I%20saw%20your%20portfolio!",
    icon: Mail,
    label: "Email",
  },
];

export const cvInfo = {
  title: "Curriculum Vitae",
  previewImage: "/assets/Screenshot_CV.png",
  downloadPath: "/assets/CV_Shendy Putra Perdana Yohansah_19 Sep 2025.pdf",
};

export const techStacks: TechStack[] = [
  { name: "React", src: "/assets/img/content/react.png" },
  { name: "TypeScript", src: "/assets/img/content/typescript.png" },
  { name: "JavaScript", src: "/assets/img/content/javascript.png" },
  { name: "Redux", src: "/assets/img/content/redux.png" },
  { name: "Axios", src: "/assets/img/content/axios.png" },
  { name: "Jest", src: "/assets/img/content/jest.png" },
  { name: "NodeJS", src: "/assets/img/content/nodejs.png" },
  { name: "Firebase", src: "/assets/img/content/firebase.png" },
  { name: "Vue", src: "/assets/img/content/vue.png" },
];

export const loves: Love[] = [
  {
    main: { name: "DOTA 2", src: "/assets/img/content/dota-2.png" },
    clubs: [
      { name: "Rekonix", src: "/assets/img/content/rekonix.png" },
      {
        name: "Tundra Esports",
        src: "/assets/img/content/tundra-esports.png",
      },
    ],
  },
  {
    main: { name: "Football", src: "/assets/img/content/football.png" },
    clubs: [
      { name: "Real Madrid", src: "/assets/img/content/real-madrid.png" },
    ],
  },
  {
    main: { name: "Basketball", src: "/assets/img/content/basketball.png" },
    clubs: [
      { name: "Los Angeles Lakers", src: "/assets/img/content/lakers.png" },
      {
        name: "Golden State Warriors",
        src: "/assets/img/content/warriors.png",
      },
    ],
  },
];
