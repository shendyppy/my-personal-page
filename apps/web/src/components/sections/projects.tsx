import { ProjectsScroll } from "@/components/organisms/ProjectsScroll";
import { getProjects } from "@/server/queries/projects";

export const Projects = async () => {
  const projects = await getProjects();

  return <ProjectsScroll projects={projects} />;
};
