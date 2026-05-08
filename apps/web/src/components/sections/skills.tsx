import { getSkills } from "@/server/queries/skills";
import { SkillsList } from "@/components/organisms/SkillsList";

export const Skills = async () => {
  const data = await getSkills();
  return <SkillsList initialData={data} />;
};
