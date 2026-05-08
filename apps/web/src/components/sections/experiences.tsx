import { getExperiences } from "@/server/queries/experiences";
import { ExperiencesList } from "@/components/organisms/ExperiencesList";

export const Experiences = async () => {
  const data = await getExperiences();
  return <ExperiencesList initialData={data} />;
};
