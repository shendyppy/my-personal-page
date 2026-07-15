import { getSkills } from "@/server/queries/skills";
import { Toolbox } from "@/components/organisms/Toolbox";

export const Skills = async () => {
  const data = await getSkills();
  return <Toolbox skills={data} />;
};
